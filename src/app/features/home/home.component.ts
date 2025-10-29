import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavbarComponent } from "../../layout/navbar/navbar.component";
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/interfaces/category/category.interface';
import { failedToSaveCategory, failedToSoftDeleteCategory, isPayloadTooLarge, categoryImageTooLarge } from '../../shared/constants/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AccordionModule, TabsModule, DialogModule, ButtonModule, InputTextModule, DropdownModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  selectedIndex: string | number = 0;
  
  isParentMode: boolean = true;
  isEditMode: boolean = false;
  isDialogShowing: boolean = false;
  editingCategoryId: string | null = null;
  categoryForm!: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  imagePreviewUrl: string | null = null;
  financialTypes: { label: string; value: boolean }[] = [{ label: 'Expense', value: false }, { label: 'Income', value: true }];

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) {
    this.categoryForm = this.formBuilder.group({ name: ['', Validators.required], image: [null], financialType: [null], parentCategory: [null] });
  }

  get name() { return this.categoryForm.controls['name']; }
  get image() { return this.categoryForm.controls['image']; }
  get financialType() { return this.categoryForm.controls['financialType']; }
  get parentCategory() { return this.categoryForm.controls['parentCategory']; }

  ngOnInit(): void { this.loadCategories(); }

  navigateToCategoriesRecycleBin = () => this.router.navigate(['/categories/recycle-bin']);

  onTabChange = (index: string | number) => (this.selectedIndex = +index, this.loadCategories())

  async openDialog(isParent: boolean, isEditing: boolean, category?: Category): Promise<void> {
    this.isParentMode = isParent, this.isEditMode = isEditing, this.isDialogShowing = true;
    this.editingCategoryId = isEditing && category?.id || null;
    this.financialType.setValidators(isParent ? Validators.required : null), this.financialType.updateValueAndValidity();
    this.parentCategory.setValidators(!isParent ? Validators.required : null), this.parentCategory.updateValueAndValidity();
    if (!category) return;
    
    isParent ? this.financialType.setValue(category.isIncome) : this.parentCategory.setValue(isEditing ? this.categories.find(parent => parent.id === category.parentId) ?? null : category);
    if (isEditing) {
      this.name.setValue(category.name);
      if (category.imageUrl) {
        const blob = await (await fetch(category.imageUrl)).blob();
        this.imagePreviewUrl = category.imageUrl, this.image.setValue(new File([blob], category.imageUrl.split('/').pop() || 'image.png', { type: blob.type }));
      }
    }
    this.categoryForm.updateValueAndValidity();
  }

  resetForm(): void {
    this.imagePreviewUrl && URL.revokeObjectURL(this.imagePreviewUrl);
    this.categoryForm.reset(), this.imagePreviewUrl = null, this.fileInput.nativeElement.value = '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement, file = input.files?.[0];
    file && (this.image.setValue(file), this.imagePreviewUrl = URL.createObjectURL(file))
    input.value = '';
  }

  removeImage = () => (this.imagePreviewUrl && URL.revokeObjectURL(this.imagePreviewUrl), this.imagePreviewUrl = null, this.image.setValue(null))

  confirmDelete = (id: string) => this.confirmationService.confirm({ header: 'Confirm Delete', message: 'Are you sure you want to move this category to recycle bin?', icon: 'pi pi-exclamation-triangle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.deleteCategory(id) });

  confirmCancel = () => this.confirmationService.confirm({ header: 'Confirm Cancel', message: 'Are you sure you want to cancel? All changes will be lost.', icon: 'pi pi-info-circle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.isDialogShowing = false });

  saveCategory(): void {
    if (this.categoryForm.invalid) return;
    const { name, image, financialType, parentCategory } = this.categoryForm.value;
    
    const formData = new FormData();
    formData.append('name', name);
    image && formData.append('image', image);
    this.isParentMode ? formData.append('isIncome', financialType.toString()) : formData.append('parentId', parentCategory.id);

    (this.isEditMode && this.editingCategoryId ? this.categoryService.edit(formData, this.editingCategoryId) : this.categoryService.add(formData)).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.isDialogShowing = false, this.loadCategories()),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: isPayloadTooLarge(error) ? 'File too large' : error?.title || 'Error', detail: isPayloadTooLarge(error) ? categoryImageTooLarge : error?.detail || failedToSaveCategory })
    })
  }

  deleteCategory = (id: string) => this.categoryService.softDelete(id).subscribe({
    next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.loadCategories()),
    error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || failedToSoftDeleteCategory })
  })

  private loadCategories = () => this.categoryService.getTree(this.selectedIndex === 1).pipe(take(1)).subscribe(categories => this.categories = categories);
}
