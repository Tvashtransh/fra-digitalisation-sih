import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet";

export default function Modal({
  trigger,
  title,
  description,
  children,
  side = "right",
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || <Button variant="outline">Open Modal</Button>}
      </SheetTrigger>
      <SheetContent side={side} className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}