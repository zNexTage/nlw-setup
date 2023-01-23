interface IProgessBarProps {
    progress: number
}

const ProgressBar = ({ progress }: IProgessBarProps) => {
    const progressStyle = {
        width: `${progress}%`
    }

    return (
        <div className='h-3 rounded-xl bg-zinc-700 w-full mt-4'>


            <div
                role='progressbar'
                aria-label='Progresso de hábitos completados nesse dia'
                aria-valuenow={progress}
                className='h-3 rounded-xl bg-violet-600 transition-all'
                style={progressStyle}
            >

            </div>
        </div>
    )
}

export default ProgressBar;