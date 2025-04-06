import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useState } from "react"

type MaintenancePhotoViewerProps = {
    selectedPhotos: string[],
    clearPhoto: () => void
}

const MaintenancePhotoViewer = ({
    selectedPhotos,
    clearPhoto
}: MaintenancePhotoViewerProps) => {
    const [photoViewerOpen, setPhotoViewerOpen] = useState(false)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % selectedPhotos.length)
    }
    
    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length)
    }

    useEffect(() => {
        if (selectedPhotos.length > 0) {
            setCurrentPhotoIndex(0)
            setPhotoViewerOpen(true)
        } else {
            setPhotoViewerOpen(false)
        }
    }, [selectedPhotos])

    // if the photo viewer is closed, clear the selected photos
    useEffect(() => {
        if(photoViewerOpen === false) {
            clearPhoto();
        } 
    }, [photoViewerOpen])

    return (
        <Dialog open={photoViewerOpen} onOpenChange={setPhotoViewerOpen}>
            <DialogContent className="sm:max-w-[80vw] min-h-[70vh] max-h-[90vh] p-0 overflow-hidden border-none outline-none">
                <div className="relative h-full flex flex-col">
                    <div className="absolute top-2 right-2 z-10">
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                        onClick={() => setPhotoViewerOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 flex items-center justify-center bg-black/90 p-4">
                        {selectedPhotos.length > 0 && (
                            <img
                            src={selectedPhotos[currentPhotoIndex] || "/placeholder.svg"}
                            alt={`Photo ${currentPhotoIndex + 1}`}
                            className="max-h-[80vh] max-w-full object-contain"
                            />
                        )}
                    </div>

                    {selectedPhotos.length > 1 && (
                        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                            onClick={prevPhoto}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                            onClick={nextPhoto}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    )}

                    {selectedPhotos.length > 1 && (
                        <div className="absolute bottom-4 inset-x-0 flex justify-center">
                            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentPhotoIndex + 1} / {selectedPhotos.length}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MaintenancePhotoViewer