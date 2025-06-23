import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { NavbarComponent } from '../../../layout/navbar/navbar.component';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/interfaces/category/category.interface';

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

  constructor(private categoryService: CategoryService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void { this.loadCategories(); }

  onTabChange = (index: string | number) => (this.selectedIndex = +index, this.loadCategories());

  navigateToHome = () => this.router.navigate(['/']);

  restore = (id: string) => { throw new Error('Method not implemented.'); };

  private loadCategories = () => this.categoryService.getTreeByType(this.selectedIndex === 1, true).pipe(take(1)).subscribe(deletedCategories => this.deletedCategories = deletedCategories);
}
