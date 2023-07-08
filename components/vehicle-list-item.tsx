"use client";
import { deleteVehicleAction } from "@/app/_actions/_vehicleActions";
import { canIssueReport, englishDateFormat, slugify } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { ExtendedVehicle, PaginationProps, VehiclesFilterProps } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import ConfirmDelete from "./confirm-delete";
import { Icons } from "./icons";
import ToastDesc from "./ToastDesc";
import { Button, buttonVariants } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";
import { toast } from "./ui/use-toast";

type VehicleListProps = {
  vehicle: ExtendedVehicle;
  searchParams: PaginationProps & VehiclesFilterProps;
  isAdminUser: boolean;
};
const VehicleListItem = ({
  vehicle,
  searchParams,
  isAdminUser,
}: VehicleListProps) => {
  // const { page, pageSize, search, sortby, order, from, to } = searchParams;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = async () => {
    startTransition(() => {
      deleteVehicleAction(vehicle.id).then((res) => {
        const data = JSON.parse(res);
        if (data.success) {
          toast({
            title: "Success",
            description: <ToastDesc>Vehicle Deleted Successfully</ToastDesc>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error ",
            description: <ToastDesc error>Error Deleting Vehicle!</ToastDesc>,
          });
        }
      });
    });
    router.refresh();
  };

  return (
    <TableRow>
      <TableCell className="px-1 font-bold ">{slugify(vehicle.id)}</TableCell>
      <TableCell className="hidden px-1 text-center whitespace-nowrap md:table-cell">
        {vehicle.vin}
      </TableCell>
      <TableCell
        dir="rtl"
        className="hidden max-w-[100px] md:table-cell px-1 text-center "
      >
        {vehicle.customer?.name}
      </TableCell>
      <TableCell className="hidden px-1 text-center md:table-cell">
        {vehicle.reqNo}
      </TableCell>
      <TableCell className="hidden px-1 max-w-[100px] text-center md:table-cell">
        {/* {ports.find((v) => v.description === vehicle.port)?.name} */}
        {vehicle.port}
      </TableCell>
      <TableCell className="hidden px-1 text-center md:table-cell">
        {vehicle?.broker?.name}
      </TableCell>
      <TableCell className="hidden px-1 text-center md:table-cell">
        {englishDateFormat(vehicle.createdAt)}
      </TableCell>

      <TableCell className="px-1 ">
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "whitespace-nowrap text-center "
          )}
          href={`/results/${vehicle.id}?${new URLSearchParams(
            searchParams
          ).toString()}`}
        >
          {canIssueReport(vehicle as ExtendedVehicle)
            ? "View Result"
            : "Add Result"}
        </Link>
      </TableCell>
      <TableCell className="px-1 text-center ">
        <Link
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          href={`/vehicles/${vehicle.id}?${new URLSearchParams(
            searchParams
          ).toString()}`}
        >
          Edit
        </Link>
      </TableCell>
      <TableCell className="hidden px-1 text-center md:table-cell">
        <Link
          className={cn(buttonVariants({ size: "sm" }))}
          target={"_blank"}
          href={`/reports/${vehicle.id}/receipt`}
        >
          <Icons.print className="w-4 h-4" />
        </Link>
      </TableCell>
      <TableCell className="px-1 text-center">
        <Button
          variant="secondary"
          size={"sm"}
          className="ring-2 ring-gray-300"
          disabled={!canIssueReport(vehicle as ExtendedVehicle)}
        >
          <Link target={"_blank"} href={`/reports/${vehicle.id}`}>
            {canIssueReport(vehicle as ExtendedVehicle) ? (
              <Icons.report className="w-5 h-5" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ban"
              >
                <circle cx="10" cy="10" r="8" />
                <path d="m4.7 4.7 11 11" />
              </svg>
            )}
          </Link>
        </Button>
      </TableCell>

      {isAdminUser && (
        <TableCell className="text-right ">
          <ConfirmDelete
            handleDelete={handleDelete}
            title="Are you Sure you want to delete this Vehicle?"
            desc="This action will lead to a missing vehicle_id."
            isPending={isPending}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

export default VehicleListItem;
