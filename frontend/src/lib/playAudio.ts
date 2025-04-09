
export const playAudio = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch((err) => {
        console.error("Audio play failed", err);
    })
}