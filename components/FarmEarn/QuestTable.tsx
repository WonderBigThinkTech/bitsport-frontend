import { useState } from "react"
import Pagination from "../Pagination"
import Button, { variantTypes, volumeTypes } from "../Button";
import Image from "next/image";

interface QuestTablePropsType {
    questData: any[]
}

export default function QuestTable({ questData }: QuestTablePropsType) {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (number: number) => {
        setCurrentPage(number);
    }

    return (
        <div className="p-6">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="bg-primary-100 text-gray-500 p-2"></th>
                        <th className="bg-primary-100 text-gray-500 p-2 w-[25%]">AMOUNT</th>
                        <th className="bg-primary-100 text-gray-500 p-2 w-[25%]">WIN STREAK</th>
                        <th className="bg-primary-100 text-gray-500 p-2 w-[25%]">DIFFICULTY</th>
                        <th className="bg-primary-100 text-gray-500 p-2"></th>
                    </tr>
                </thead>
                {questData && questData.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10).map((item: any, _idx: number) => {
                    return (
                        <tr key={_idx}>
                            <td className="bg-primary-400 text-center p-4"><Image className="min-w-[50px]" width={50} height={50} src="/busd.png" alt="" /></td>
                            <td className="bg-primary-400 text-center p-4">
                                <span className="text-white text-base font-semibold">{item.amount}</span>
                                {" "}
                                <span className="text-gray-600 text-base font-semibold">BITS</span>
                            </td>
                            <td className="bg-primary-400 text-center p-4">
                                <span className="text-white text-base font-semibold">0 / {item.streak}</span>
                            </td>
                            <td className="bg-primary-400 text-center p-4">
                                <span className="text-white text-base font-semibold">{item.difficulty === 0
                                    ? "EASY"
                                    : item.difficulty === 1
                                        ? "MEDIUM"
                                        : "HARD"}</span>
                            </td>
                            <td className="bg-primary-400 text-center p-4">
                                <Button
                                    variant={variantTypes.secondary}
                                    textVol={volumeTypes.sm}
                                    onClick={() => { }}
                                    px="xl:px-20 px-5"
                                    text={"ACCEPT"}
                                />
                            </td>
                        </tr>
                    )
                })}
            </table>
            <Pagination
                currentPage={currentPage}
                total={Math.ceil(questData.length / 10)}
                onPageChange={handlePageChange}
            />
        </div>
    )
}