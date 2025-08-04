import { ChatInterface } from "@/components/chat/chat-interface";

export default function ForumPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Community Forum</h1>
                <p className="text-lg text-muted-foreground mt-2">Connect, share, and learn with fellow members.</p>
            </div>
            <ChatInterface />
        </div>
    )
}
