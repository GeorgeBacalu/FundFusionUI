import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { CategoryService } from '../../core/services/category.service';
import { NavbarComponent } from "../../layout/navbar/navbar.component";
import { Category } from '../../shared/interfaces/category/category.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AccordionModule, TabsModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  selectedIndex: string | number = 0;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void { this.loadCategories(); }

  onTabChange = (index: string | number) => (this.selectedIndex = +index, this.loadCategories())

  loadCategories = () => this.categoryService.getTreeByType(this.selectedIndex === 1).subscribe(categories => this.categories = categories);

  navigateToSubcategories = (parentId: string) => this.router.navigate(['/categories', parentId]);
}
