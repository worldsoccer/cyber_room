"use client";

import { Icons } from "../../icon/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FileEditDialog from "./file-edit-dialog";
import FileDeleteDialog from "./file-delete-dialog";
import FileMoveDialog from "./file-move-dialog";

interface FileOperationsProps {
  file: {
    id: number;
    name: string;
  };
}

export default function FileOperations({ file }: FileOperationsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Icons.ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <FileEditDialog fileId={file.id} initialFileName={file.name} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <FileMoveDialog fileId={file.id} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <FileDeleteDialog fileId={file.id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
