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
import { failedToAddCategory, failedToAddSubcategory } from '../../shared/constants/constants';

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

  @ViewChild('categoryFileInput') categoryFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('subCategoryFileInput') subCategoryFileInput!: ElementRef<HTMLInputElement>;
  isCategoryDialogShowing: boolean = false;
  isSubcategoryDialogShowing: boolean = false;
  addCategoryForm!: FormGroup;
  addSubcategoryForm!: FormGroup;
  financialTypes: { label: string; value: boolean }[] = [{ label: 'Expense', value: false }, { label: 'Income', value: true }];

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.addCategoryForm = this.formBuilder.group({ name: ['', Validators.required], financialType: [null, Validators.required], image: [null] });
    this.addSubcategoryForm = this.formBuilder.group({ name: ['', Validators.required], parentCategory: [null, Validators.required], image: [null] });
  }

  get name() { return this.addCategoryForm.controls['name']; }
  get financialType() { return this.addCategoryForm.controls['financialType']; }
  get parentCategory() { return this.addSubcategoryForm.controls['parentCategory']; }

  ngOnInit(): void { this.loadCategories(); }

  onTabChange = (index: string | number) => (this.selectedIndex = +index, this.loadCategories())

  resetCategoryForm = () => (this.addCategoryForm.reset(), this.categoryFileInput.nativeElement.value = '')

  resetSubcategoryForm = () => (this.addSubcategoryForm.reset(), this.subCategoryFileInput.nativeElement.value = '')

  onCategoryImageSelected = (event: Event) => this.addCategoryForm.get('image')?.setValue((event.target as HTMLInputElement)?.files?.[0] );

  onSubcategoryImageSelected = (event: Event) => this.addSubcategoryForm.get('image')?.setValue((event.target as HTMLInputElement)?.files?.[0]);

  confirmCategoryCancel = () => this.confirmationService.confirm({ header: 'Confirm Cancel', message: 'Are you sure you want to cancel? All changes will be lost.', icon: 'pi pi-info-circle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.isCategoryDialogShowing = false });

  confirmSubcategoryCancel = () => this.confirmationService.confirm({ header: 'Confirm Cancel', message: 'Are you sure you want to cancel? All changes will be lost.', icon: 'pi pi-info-circle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.isSubcategoryDialogShowing = false });

  addCategory(): void {
    if (this.addCategoryForm.invalid) return;
    const { name, financialType, image } = this.addCategoryForm.value;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('isIncome', financialType.toString());
    if (image) formData.append('image', image);

    this.categoryService.add(formData).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.isCategoryDialogShowing = false, this.loadCategories()),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || failedToAddCategory })
    })
  }

  addSubcategory(): void {
    if (this.addSubcategoryForm.invalid) return;
    const { name, parentCategory, image } = this.addSubcategoryForm.value;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('parentId', parentCategory.id);
    if (image) formData.append('image', image);

    this.categoryService.add(formData).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.isSubcategoryDialogShowing = false, this.loadCategories()),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || failedToAddSubcategory })
    })
  }

  private loadCategories = () => this.categoryService.getTreeByType(this.selectedIndex === 1).subscribe(categories => this.categories = categories);
}
