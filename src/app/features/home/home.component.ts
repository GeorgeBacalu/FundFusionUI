import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { failedToAddCategory } from '../../shared/constants/constants';

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
  isDialogShowing: boolean = false;
  categoryForm!: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  imagePreviewUrl: string | null = null;
  financialTypes: { label: string; value: boolean }[] = [{ label: 'Expense', value: false }, { label: 'Income', value: true }];

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.categoryForm = this.formBuilder.group({ name: ['', Validators.required], image: [null], financialType: [null], parentCategory: [null] });
  }

  get name() { return this.categoryForm.controls['name']; }
  get image() { return this.categoryForm.controls['image']; }
  get financialType() { return this.categoryForm.controls['financialType']; }
  get parentCategory() { return this.categoryForm.controls['parentCategory']; }

  ngOnInit(): void { this.loadCategories(); }

  onTabChange = (index: string | number) => (this.selectedIndex = +index, this.loadCategories())

  openDialog(isParent: boolean, parentCategory?: Category) {
    this.isParentMode = isParent, this.isDialogShowing = true;
    this.financialType?.setValidators(isParent ? Validators.required : null);
    this.parentCategory?.setValidators(isParent ? null : Validators.required);
    if (!isParent) this.parentCategory?.setValue(parentCategory);
    this.categoryForm.updateValueAndValidity();
  }

  resetForm = () => {
    if (this.imagePreviewUrl) URL.revokeObjectURL(this.imagePreviewUrl);
    this.categoryForm.reset(), this.fileInput.nativeElement.value = '', this.imagePreviewUrl = null
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.image?.setValue(file), this.imagePreviewUrl = file ? URL.createObjectURL(file) : null;
  }

  confirmCancel = () => this.confirmationService.confirm({ header: 'Confirm Cancel', message: 'Are you sure you want to cancel? All changes will be lost.', icon: 'pi pi-info-circle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.isDialogShowing = false });

  addCategory(): void {
    if (this.categoryForm.invalid) return;
    const { name, image, financialType, parentCategory } = this.categoryForm.value;
    
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    this.isParentMode ? formData.append('isIncome', financialType.toString()) : formData.append('parentId', parentCategory.id);
  
    this.categoryService.add(formData).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.isDialogShowing = false, this.loadCategories()),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || failedToAddCategory })
    })
  }

  private loadCategories = () => this.categoryService.getTreeByType(this.selectedIndex === 1).pipe(take(1)).subscribe(categories => this.categories = categories);
}
