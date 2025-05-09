import { File } from "lucide-react";

type ChatAttachmentsProps = {
    attachments: string[],
    openPhotoViewer: (photos: string[]) => void,
}

const ChatAttachments = ({
    attachments,
    openPhotoViewer,
}: ChatAttachmentsProps) => {
    
    const images = attachments.filter((attachment) => !isDocumentFile(attachment));
    const documents = attachments.filter((attachment) => isDocumentFile(attachment));

    return (
        <div className="mt-1 space-y-2">
            {images.length <= 3 ? (
                <div className="flex flex-wrap gap-2">
                    {images.map((attachment, index) => (
                            <div
                            key={index}
                            className="relative cursor-pointer"
                            onClick={() => openPhotoViewer(images)}
                            >
                                <img
                                src={attachment || "/placeholder.svg"}
                                alt="Attachment"
                                className="max-h-40 rounded-md object-cover"
                                />
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="relative cursor-pointer">
                    <div className="relative" onClick={() => openPhotoViewer(images)}>
                        <img
                        src={images[0] || "/placeholder.svg"}
                        alt="Attachment"
                        className="max-h-40 rounded-md object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                            <span className="text-white font-medium">+{images.length - 1} more</span>
                        </div>
                    </div>
                </div>
            )}

            {documents.length > 0 && (
                <div className="flex flex-col gap-1 items-start">
                    {documents.map((attachment, index) => (
                            <div
                            key={index}
                            onClick={() => window.open(attachment, "_blank")}
                            className="relative cursor-pointer flex"
                            >
                                <div className="relative w-full h-8 bg-white rounded flex items-center justify-center p-2">
                                    <File className="h-6 w-6 text-primary" />
                                    <span className="ml-2 text-sm text-black font-medium truncate">{attachment.split('/').pop()}</span>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

// lib function
const isDocumentFile = (fileUrl: string) => {
    const documentsExtensions = [
        '.pdf', '.doc', '.docx', '.xls', '.xlsx',
        '.ppt', '.pptx', '.txt', '.csv', '.json',
        '.xml', '.zip', '.rar', '.7z', '.tar.gz'
    ];

    const lowerUrl = fileUrl.toLowerCase();
    return documentsExtensions.some((ext) => lowerUrl.endsWith(ext));
}

export default ChatAttachments