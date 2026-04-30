import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Course, Lecture } from "../../../types";
import { useAppContext } from "../../../context/AppContext";
import { LectureItem } from "./LectureItem";
import { LectureDialog } from "./LectureDialog";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useConfirm } from "../../../hooks/useConfirm";

interface LectureListProps {
    course: Course;
}

export function LectureList({ course }: LectureListProps) {
    const { dispatch } = useAppContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    useKeyboardShortcuts({
        'ctrl+l': () => {
            setEditingLecture(null);
            setIsDialogOpen(true);
        }
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // minimum drag distance before activating
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = course.lectures.findIndex(l => l.id === active.id);
            const newIndex = course.lectures.findIndex(l => l.id === over.id);
            
            const newLectures = arrayMove(course.lectures, oldIndex, newIndex);
            
            dispatch({
                type: 'REORDER_LECTURES',
                payload: { courseId: course.id, lectures: newLectures }
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const activeLecture = activeId ? course.lectures.find(l => l.id === activeId) : null;

    const handleSaveLecture = (name: string) => {
        if (editingLecture) {
            dispatch({
                type: 'UPDATE_LECTURE',
                payload: {
                    courseId: course.id,
                    lectureId: editingLecture.id,
                    updates: { name }
                }
            });
        } else {
            const newLecture: Lecture = {
                id: crypto.randomUUID(),
                name,
                status: 'not_started',
                notes: '',
                attachments: [],
                links: [],
                order: course.lectures.length,
                createdAt: new Date().toISOString()
            };
            dispatch({
                type: 'ADD_LECTURE',
                payload: { courseId: course.id, lecture: newLecture }
            });
        }
    };

    const handleStatusChange = (lectureId: string, status: Lecture['status']) => {
        dispatch({
            type: 'UPDATE_LECTURE',
            payload: { courseId: course.id, lectureId, updates: { status } }
        });
    };

    const handleDelete = async (lectureId: string) => {
        if (await confirm("Are you sure you want to delete this lecture?", "Delete Lecture")) {
            dispatch({
                type: 'DELETE_LECTURE',
                payload: { courseId: course.id, lectureId }
            });
        }
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Lectures</h3>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={() => { setEditingLecture(null); setIsDialogOpen(true); }}>
                            <Plus className="w-4 h-4 mr-2" /> Add Lecture
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Lecture (Ctrl+L)</TooltipContent>
                </Tooltip>
            </div>

            {course.lectures.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground bg-muted/20">
                    No lectures added yet. Click 'Add Lecture' to get started.
                </div>
            ) : (
                <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext items={course.lectures.map(l => l.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1 pb-20">
                            {course.lectures.map(lecture => (
                                <LectureItem 
                                    key={lecture.id} 
                                    courseId={course.id}
                                    lecture={lecture} 
                                    onEdit={() => { setEditingLecture(lecture); setIsDialogOpen(true); }}
                                    onDelete={handleDelete}
                                    onChangeStatus={handleStatusChange}
                                />
                            ))}
                        </div>
                    </SortableContext>
                    <DragOverlay>
                        {activeLecture ? (
                            <LectureItem 
                                courseId={course.id}
                                lecture={activeLecture} 
                                onEdit={() => {}}
                                onDelete={() => {}}
                                onChangeStatus={() => {}}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            <LectureDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen}
                onSave={handleSaveLecture}
                initialName={editingLecture?.name}
            />
            {ConfirmDialog}
        </div>
    );
}
