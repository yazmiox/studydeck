import { useState } from "react";
import { Globe, Plus, Trash2, ExternalLink } from "lucide-react";
import { Link } from "../../../types";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useAppContext } from "../../../context/AppContext";
import { useConfirm } from "../../../hooks/useConfirm";

interface LectureLinksProps {
    courseId: string;
    lectureId: string;
    links: Link[];
}

export function LectureLinks({ courseId, lectureId, links }: LectureLinksProps) {
    const { dispatch } = useAppContext();
    const { confirm, ConfirmDialog } = useConfirm();
    const [showForm, setShowForm] = useState(false);
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");

    const handleAdd = () => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) return;

        // Auto-prepend https:// if missing
        const finalUrl = trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")
            ? trimmedUrl
            : `https://${trimmedUrl}`;

        dispatch({
            type: 'ADD_LINK',
            payload: {
                courseId,
                lectureId,
                link: {
                    id: crypto.randomUUID(),
                    name: name.trim() || finalUrl,
                    url: finalUrl,
                    addedAt: new Date().toISOString()
                }
            }
        });

        setUrl("");
        setName("");
        setShowForm(false);
    };

    const handleDelete = async (linkId: string) => {
        if (await confirm("Are you sure you want to remove this link?", "Remove Link")) {
            dispatch({
                type: 'DELETE_LINK',
                payload: { courseId, lectureId, linkId }
            });
        }
    };

    const handleOpen = (linkUrl: string) => {
        window.electronAPI.openLink(linkUrl);
    };

    const safeLinks = links || [];

    return (
        <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Links</h4>
                <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="h-7 text-xs px-2">
                    <Plus className="w-3 h-3 mr-1" /> Add Link
                </Button>
            </div>

            {showForm && (
                <div className="flex flex-col gap-2 p-3 border rounded-md bg-background">
                    <Input
                        placeholder="URL (e.g. youtube.com/watch?v=...)"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        autoFocus
                    />
                    <Input
                        placeholder="Label (optional)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    />
                    <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setUrl(""); setName(""); }}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleAdd} disabled={!url.trim()}>
                            Add
                        </Button>
                    </div>
                </div>
            )}

            {safeLinks.length === 0 && !showForm ? (
                <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4 text-center bg-background/50">
                    No links added yet. Click 'Add Link' to save a URL.
                </div>
            ) : (
                <div className="space-y-1.5">
                    {safeLinks.map(link => (
                        <div key={link.id} className="flex items-center justify-between p-2 rounded border bg-background group hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer" onClick={() => handleOpen(link.url)}>
                                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-sm font-medium truncate hover:text-primary transition-colors">
                                    {link.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpen(link.url)}>
                                    <ExternalLink className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(link.id)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ConfirmDialog />
        </div>
    );
}
