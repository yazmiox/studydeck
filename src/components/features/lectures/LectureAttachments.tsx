import { Paperclip, Plus, Trash2, ExternalLink } from "lucide-react";
import { Attachment } from "../../../types";
import { Button } from "../../ui/button";
import { useAppContext } from "../../../context/AppContext";
import { useConfirm } from "../../../hooks/useConfirm";

interface LectureAttachmentsProps {
    courseId: string;
    lectureId: string;
    attachments: Attachment[];
}

export function LectureAttachments({ courseId, lectureId, attachments }: LectureAttachmentsProps) {
    const { dispatch } = useAppContext();
    const { confirm, ConfirmDialog } = useConfirm();

    const handleAddFiles = async () => {
        const files = await window.electronAPI.openFileDialog();
        if (files && files.length > 0) {
            files.forEach(file => {
                dispatch({
                    type: 'ADD_ATTACHMENT',
                    payload: {
                        courseId,
                        lectureId,
                        attachment: {
                            id: crypto.randomUUID(),
                            name: file.name,
                            path: file.path,
                            size: file.size,
                            addedAt: new Date().toISOString()
                        }
                    }
                });
            });
        }
    };

    const handleOpenFile = (path: string) => {
        window.electronAPI.openFile(path);
    };

    const handleDelete = async (attachmentId: string) => {
        if (await confirm("Are you sure you want to remove this attachment?", "Remove Attachment")) {
            dispatch({
                type: 'DELETE_ATTACHMENT',
                payload: { courseId, lectureId, attachmentId }
            });
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attachments</h4>
                <Button variant="outline" size="sm" onClick={handleAddFiles} className="h-7 text-xs px-2">
                    <Plus className="w-3 h-3 mr-1" /> Add Files
                </Button>
            </div>
            
            {attachments.length === 0 ? (
                <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4 text-center bg-background/50">
                    No files attached yet. Click 'Add Files' to browse.
                </div>
            ) : (
                <div className="space-y-1.5">
                    {attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between p-2 rounded border bg-background group hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer" onClick={() => handleOpenFile(att.path)}>
                                <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-sm font-medium truncate hover:text-primary transition-colors">{att.name}</span>
                                <span className="text-xs text-muted-foreground shrink-0 ml-2 bg-muted px-1.5 py-0.5 rounded">{formatSize(att.size)}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenFile(att.path)}>
                                    <ExternalLink className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(att.id)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {ConfirmDialog}
        </div>
    );
}
