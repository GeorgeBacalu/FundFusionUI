import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CategoryService } from '../../../core/services/category.service';
import { NavbarComponent } from '../../../layout/navbar/navbar.component';
import { Category } from '../../../shared/interfaces/category/category.interface';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CardModule, NavbarComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const parentId = this.route.snapshot.paramMap.get('id');
    if (parentId) this.categoryService.getChildren(parentId).subscribe(categories => this.categories = categories);
  }

  navigateToSubcategories = (parentId: string) => this.router.navigate(['/categories', parentId]);
}
