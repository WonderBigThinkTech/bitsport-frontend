import { ArrowLeft, ArrowRight } from "@/public/icons";

const Pagination = ({ currentPage, data, total, onPageChange }: any) => {
  return (
    <div className="flex mt-4 justify-between items-center">
      <div className="text-sm text-primary-500">
        Showing {data?.length} of 10 <span className="xl:hidden">PVP</span>
        <span className="hidden xl:inline">tournaments</span>
      </div>
      <div className="flex items-center gap-1">
        <div
          className={`w-8 h-8 bg-primary-550 cursor-pointer rounded-sm border border-primary-150 flex justify-center items-center`}
          onClick={
            Number(currentPage) <= 1
              ? () => {}
              : () => onPageChange(currentPage - 1)
          }
        >
          <ArrowLeft />
        </div>
        {[...new Array(total)].map((item, index) => (
          <div
            key={index}
            className={`w-8 h-8 cursor-pointer rounded-sm border flex justify-center items-center ${
              Number(currentPage - 1) === index
                ? "border-secondary-100"
                : "border-primary-150"
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            <div className="text-primary-500 text-sm">{index + 1}</div>
          </div>
        ))}
        <div
          className={`w-8 h-8 cursor-pointer rounded-sm border border-primary-150 flex justify-center items-center`}
          onClick={
            Number(currentPage) >= Number(total)
              ? () => {}
              : () => onPageChange(currentPage + 1)
          }
        >
          <ArrowRight />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
