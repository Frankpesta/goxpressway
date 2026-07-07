"use client";

import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WizardData } from "@/types/wizard";
import { ArrowLeft, CheckCircle2, Loader2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: WizardData;
  onBack: () => void;
  editShipmentId?: Id<"shipments">;
  editTrackingCode?: string;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
      {children}
    </p>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="font-medium break-all">{value}</span>
    </div>
  );
}

export function Step7Review({ data, onBack, editShipmentId, editTrackingCode }: Props) {
  const router = useRouter();
  const createShipment = useMutation(api.shipments.createShipment);
  const updateShipment = useMutation(api.shipments.updateShipment);
  const replaceCheckpoints = useMutation(api.routes.replaceRouteCheckpoints);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const isEdit = !!editShipmentId;

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const { sender, receiver, items, pricing, checkpoints } = data;

      const checkpointArgs =
        checkpoints.length >= 2
          ? checkpoints.map((cp, i) => ({
              cityName: cp.cityName,
              country: cp.country,
              latitude: cp.latitude,
              longitude: cp.longitude,
              sequence: i + 1,
            }))
          : undefined;

      const itemArgs = items.map(({ itemName, description, quantity, weight, declaredValue }) => ({
        itemName,
        description: description || undefined,
        quantity: Number(quantity),
        weight: Number(weight),
        declaredValue: Number(declaredValue),
      }));

      if (isEdit && editShipmentId) {
        // Update existing shipment
        await updateShipment({
          id: editShipmentId,
          senderFullName: sender.fullName,
          senderEmail: sender.email,
          senderPhone: sender.phone,
          senderAddress: sender.address,
          senderCity: sender.city,
          senderState: sender.state,
          senderCountry: sender.country,
          senderPostalCode: sender.postalCode,
          receiverFullName: receiver.fullName,
          receiverEmail: receiver.email,
          receiverPhone: receiver.phone,
          receiverAddress: receiver.address,
          receiverCity: receiver.city,
          receiverState: receiver.state,
          receiverCountry: receiver.country,
          receiverPostalCode: receiver.postalCode,
          shipmentType: pricing.shipmentType,
          dispatchDate: pricing.dispatchDate || undefined,
          estimatedDeliveryDate: pricing.estimatedDeliveryDate || undefined,
          shippingCost: Number(pricing.shippingCost),
          tax: Number(pricing.tax),
          insurance: Number(pricing.insurance),
          totalCost: Number(pricing.totalCost),
          weight: Number(pricing.weight),
          length: Number(pricing.length),
          width: Number(pricing.width),
          height: Number(pricing.height),
        });

        // Replace checkpoints
        await replaceCheckpoints({
          shipmentId: editShipmentId,
          checkpoints: checkpointArgs ?? [],
        });

        toast.success("Shipment updated successfully!");
        router.push(`/admin/shipments/${editTrackingCode}`);
      } else {
        // Create new shipment
        const result = await createShipment({
          senderFullName: sender.fullName,
          senderEmail: sender.email,
          senderPhone: sender.phone,
          senderAddress: sender.address,
          senderCity: sender.city,
          senderState: sender.state,
          senderCountry: sender.country,
          senderPostalCode: sender.postalCode,
          receiverFullName: receiver.fullName,
          receiverEmail: receiver.email,
          receiverPhone: receiver.phone,
          receiverAddress: receiver.address,
          receiverCity: receiver.city,
          receiverState: receiver.state,
          receiverCountry: receiver.country,
          receiverPostalCode: receiver.postalCode,
          shipmentType: pricing.shipmentType,
          status: pricing.status || "Shipment Registered",
          dispatchDate: pricing.dispatchDate || undefined,
          estimatedDeliveryDate: pricing.estimatedDeliveryDate || undefined,
          shippingCost: Number(pricing.shippingCost),
          tax: Number(pricing.tax),
          insurance: Number(pricing.insurance),
          totalCost: Number(pricing.totalCost),
          weight: Number(pricing.weight),
          length: Number(pricing.length),
          width: Number(pricing.width),
          height: Number(pricing.height),
          items: itemArgs,
          checkpoints: checkpointArgs,
        });
        setCreatedCode(result.trackingCode);
        toast.success("Shipment created successfully!");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(
        `${isEdit ? "Failed to update shipment" : "Failed to create shipment"}: ${message}`
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdCode) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Shipment Created!</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Your shipment is now live and ready to be tracked.
          </p>
        </div>
        <div className="rounded-xl bg-muted px-6 py-4 w-full max-w-xs">
          <p className="text-xs text-muted-foreground mb-1">Tracking Code</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-xl font-mono font-bold tracking-wider">{createdCode}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                navigator.clipboard.writeText(createdCode);
                toast.success("Copied to clipboard!");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/admin/shipments")}>
            View All Shipments
          </Button>
          <Button onClick={() => router.push(`/admin/shipments/${createdCode}`)}>
            View Shipment
          </Button>
        </div>
      </div>
    );
  }

  const { sender, receiver, items, pricing, checkpoints } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {isEdit ? "Review Changes" : "Review & Create"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isEdit
            ? "Review your changes before saving the shipment."
            : "Review all details before creating the shipment."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4 space-y-2">
          <SectionLabel>Sender</SectionLabel>
          <Row label="Name" value={sender.fullName} />
          <Row label="Email" value={sender.email} />
          <Row label="Phone" value={sender.phone} />
          <Row label="Address" value={`${sender.address}, ${sender.city}, ${sender.state} ${sender.postalCode}`} />
          <Row label="Country" value={sender.country} />
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <SectionLabel>Receiver</SectionLabel>
          <Row label="Name" value={receiver.fullName} />
          <Row label="Email" value={receiver.email} />
          <Row label="Phone" value={receiver.phone} />
          <Row label="Address" value={`${receiver.address}, ${receiver.city}, ${receiver.state} ${receiver.postalCode}`} />
          <Row label="Country" value={receiver.country} />
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <SectionLabel>Items ({items.length})</SectionLabel>
          {items.map((item, i) => (
            <div key={item.id} className={cn("text-sm", i > 0 && "pt-2 border-t")}>
              <p className="font-medium">{item.itemName}</p>
              <p className="text-muted-foreground text-xs">
                Qty: {item.quantity} · {item.weight} kg · ${item.declaredValue} declared
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <SectionLabel>Pricing & Details</SectionLabel>
          <Row label="Type" value={pricing.shipmentType} />
          <Row label="Status" value={pricing.status} />
          <Row label="Dispatch" value={pricing.dispatchDate || "—"} />
          <Row label="Est. Delivery" value={pricing.estimatedDeliveryDate || "—"} />
          <Row label="Dimensions" value={`${pricing.length} × ${pricing.width} × ${pricing.height} cm`} />
          <Row label="Weight" value={`${pricing.weight} kg`} />
          <Row label="Total Cost" value={`$${pricing.totalCost}`} />
        </div>

        {checkpoints.length >= 2 && (
          <div className="rounded-lg border p-4 space-y-2">
            <SectionLabel>Route ({checkpoints.length} stops)</SectionLabel>
            {checkpoints.map((cp, i) => (
              <div key={cp.id} className="text-sm flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <span>{cp.cityName}, {cp.country}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Saving..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Shipment"
          )}
        </Button>
      </div>
    </div>
  );
}
