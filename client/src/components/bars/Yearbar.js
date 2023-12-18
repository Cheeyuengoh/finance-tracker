export default function YearBar({ yearSelected, updateYearSelected }) {
    return (
        <div className='flex items-center gap-2 py-2'>
            <div className='cursor-pointer' onClick={() => { updateYearSelected('-1') }}>
                <svg className='w-3 h-3' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13" />
                </svg>
            </div>
            <div><span>{yearSelected}</span></div>
            {
                yearSelected < new Date().getFullYear() ?
                    <div className='cursor-pointer' onClick={() => { updateYearSelected('1') }}>
                        <svg className='w-3 h-3' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
                        </svg>
                    </div>
                    :
                    null
            }
        </div>
    );
}