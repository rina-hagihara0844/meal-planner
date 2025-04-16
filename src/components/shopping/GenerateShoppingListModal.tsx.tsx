import React, {useState} from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Form, FormItem, FormControl, FormMessage, FormField, FormLabel } from "../ui/form";
import { Button } from "../ui/button";

interface GenerateShoppingModalProps{
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (startDate: string, endDate: string) => Promise<void>;
}

export const GenerateShoppingModal: React.FC<GenerateShoppingModalProps> = ({
    isOpen,
    onClose,
    onGenerate,
    }) => {
        const [startDate, setStartDate] = useState<string>(
            new Date().toISOString().split('T')[0]
        );
        const [endDate, setEndDate] = useState<string>(() => {
            const date = new Date();
            date.setDate(date.getDate() + 6);
            return date.toISOString().split('T')[0];
        }
        );
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleGenerate = async () => {
            setIsSubmitting(true);
            try{
                await onGenerate(startDate, endDate);
                onClose();
            } catch(e) {
                console.error('Failed to generate shopping list:', e);
            } finally {
                setIsSubmitting(false);
            }
        };

        return(
            <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Generate Shopping List</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <p className="text-sm text-gray-600">
                        Automatically generates a shopping list based on the meal plan for the specified period.
                        </p>
                        <div>
                        <label htmlFor="start-date">Start Date</label>
                        <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full"
                        />
                        </div>
                        <div>
                        <label htmlFor="end-date">End Date</label>
                        <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full"
                        />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="cancel" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleGenerate} disabled={isSubmitting || !startDate || !endDate}>
                        {isSubmitting ? 'Submitting' : 'Generate'}        
                        </Button>
                    </DialogFooter>  
                </DialogContent>
            </Dialog>
        )
}