import {ChatBubbleOvalLeftIcon} from "@heroicons/react/24/solid";

export const WelcomeScreen = () => {
    return (
        <div className="flex flex-col gap-8 justify-center">
            <div className="bg-[#1C4D9B] rounded-lg w-fit p-2">
                <ChatBubbleOvalLeftIcon width="24px" height="24px" color={"white"} />
            </div>
            <h2 className="font-medium text-white text-4xl ">Hi there!</h2>
            <div className="flex flex-col gap-4">
                <h1 className={"font-medium text-white text-5xl"}>What would you like to know?</h1>
                <p className="font-light text-white text-2xl opacity-75">Use one of the most common prompts below or ask your own question</p>
            </div>
        </div>
    )
}