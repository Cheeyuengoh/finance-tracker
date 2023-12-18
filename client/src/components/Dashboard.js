import Transactions from "./transactions/Transactions";

export default function Dashboard(){
    return(
        <div className='w-full h-full pt-8 px-5 flex flex-col gap-2'>
            <Transactions></Transactions>
        </div>
    );
}