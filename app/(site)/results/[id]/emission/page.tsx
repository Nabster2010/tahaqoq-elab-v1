import BackButton from "@/components/back-button";
import EmissionCreateForm from "@/components/emission-create-form";
import EmissionUpdateForm from "@/components/emission-update-form";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getVehicleById } from "@/lib/db/vehicle";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Emission Results",
  description: "Add Emission results for Vehicle",
};

const EmissionResultPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const pageSize = searchParams.pageSize
    ? parseInt(searchParams.pageSize)
    : siteConfig.pageSize;
  const search = searchParams.search
    ? decodeURIComponent(searchParams.search as string)
    : "";

  const vehicleId = Number(params.id);
  const { vehicle } = await getVehicleById(vehicleId);

  const hasResult = !!vehicle?.emissionTest;

  if (!vehicle) {
    return (
      <div className="my-8 text-xl font-bold text-center">
        Vehicle Not Found!
      </div>
    );
  }
  if (!vehicle.vehicleInfo) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 my-8 text-xl font-bold text-center">
        <BackButton
          to={`/results/${vehicleId}?search=${search}&page=${page}&pageSize=${pageSize}`}
          className="self-start"
        />
        <p>Please Add Vehicle Information First</p>
        <Link
          className={cn(buttonVariants({}))}
          href={`/results/${vehicle.id}/vehicleInfo`}
        >
          Vehicle Information
        </Link>
      </div>
    );
  }
  return (
    <section className="">
      <BackButton to={`/results/${vehicleId}`} />
      {hasResult ? (
        <EmissionUpdateForm
          fuelType={vehicle.vehicleInfo.fuelType || "PETROL"}
          emissionResult={vehicle.emissionTest!}
        />
      ) : (
        <EmissionCreateForm
          fuelType={vehicle.vehicleInfo?.fuelType || "PETROL"}
          vehicleId={vehicle.id}
        />
      )}
    </section>
  );
};
export default EmissionResultPage;
