import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavbarComponent } from "../../layout/navbar/navbar.component";
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/interfaces/category/category.interface';
import { failedToAddCategory } from '../../shared/constants/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AccordionModule, TabsModule, DialogModule, ButtonModule, InputTextModule, DropdownModule, FileUploadModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  selectedIndex: string | number = 0;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  isDialogShowing: boolean = false;
  addCategoryForm!: FormGroup;
  financialTypes: { label: string; value: boolean }[] = [{ label: 'Expense', value: false }, { label: 'Income', value: true }];

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.addCategoryForm = this.formBuilder.group({ name: ['', Validators.required], financialType: [null, Validators.required], image: [null] });
  }

  get name() { return this.addCategoryForm.controls['name']; }
  get financialType() { return this.addCategoryForm.controls['financialType']; }

  ngOnInit(): void { this.loadCategories(); }

  onTabChange = (index: string | number) => (this.selectedIndex = +index, this.loadCategories())

  resetForm = () => (this.addCategoryForm.reset(), this.fileInput.nativeElement.value = '')

  onImageSelected = (event: Event) => this.addCategoryForm.get('image')?.setValue((event.target as HTMLInputElement)?.files?.[0] || null);

  confirmCancel = () => this.confirmationService.confirm({ header: 'Confirm Cancel', message: 'Are you sure you want to cancel? All changes will be lost.', icon: 'pi pi-info-circle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.isDialogShowing = false });

  addCategory(): void {
    if (this.addCategoryForm.invalid) return;
    const { name, financialType, image } = this.addCategoryForm.value;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('isIncome', financialType.toString());
    if (image) formData.append('image', image);

    this.categoryService.add(formData).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.isDialogShowing = false, this.loadCategories()),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || failedToAddCategory })
    })
  }

  private loadCategories = () => this.categoryService.getTreeByType(this.selectedIndex === 1).subscribe(categories => this.categories = categories);
}
