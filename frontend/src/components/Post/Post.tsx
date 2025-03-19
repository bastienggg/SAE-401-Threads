interface PostProps {
        content: string;
        pseudo: string;
        createdAt: string;
    }
    
    function timeSince(date: Date) {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
    
        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }
    
    export default function Post({ content, createdAt, pseudo }: PostProps) {
        if (!pseudo) {
            pseudo = "unknown";
        }
    
        return (
            <div className="flex flex-col gap-4 w-11/12 border-b-2 border-b-neutral-200 p-4">
                <div className="flex flex-row w-full justify-between items-center">
                    <p className="font-bold">@{pseudo}</p>
                    <p className="text-xs text-neutral-700">{timeSince(new Date(createdAt))} ago</p>
                </div>
                <p>{content}</p>
            </div>
        );
    }