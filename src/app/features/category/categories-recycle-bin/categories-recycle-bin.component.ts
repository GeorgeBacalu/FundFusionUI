import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavbarComponent } from '../../../layout/navbar/navbar.component';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/interfaces/category/category.interface';
import { failedToRestoreCategory, failedToHardDeleteCategory } from '../../../shared/constants/constants';

@Component({
  selector: 'app-categories-recycle-bin',
  standalone: true,
  imports: [CommonModule, AccordionModule, TabsModule, ButtonModule, NavbarComponent],
  templateUrl: './categories-recycle-bin.component.html',
  styleUrls: ['./categories-recycle-bin.component.scss']
})
export class CategoriesRecycleBinComponent implements OnInit {
  deletedCategories: Category[] = [];
  selectedIndex: string | number = 0;

  constructor(private categoryService: CategoryService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) {}

  ngOnInit(): void { this.loadCategories(); }

  onTabChange = (index: string | number) => (this.selectedIndex = +index, this.loadCategories());

  navigateToHome = () => this.router.navigate(['/']);

  confirmRestore = (id: string) => this.confirmationService.confirm({ header: 'Confirm Restore', message: 'Are you sure you want to restore this category?', icon: 'pi pi-info-circle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-success', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.categoryService.restore(id).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.loadCategories()),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || failedToRestoreCategory })
    })
  });

  confirmDelete = (id: string) => this.confirmationService.confirm({ header: 'Confirm Delete', message: 'Are you sure you want to permanently delete this category?', icon: 'pi pi-exclamation-triangle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.categoryService.hardDelete(id).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.loadCategories()),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || failedToHardDeleteCategory })
    })
  });

  private loadCategories = () => this.categoryService.getTree(this.selectedIndex === 1, true).pipe(take(1)).subscribe(deletedCategories => this.deletedCategories = deletedCategories);
}
