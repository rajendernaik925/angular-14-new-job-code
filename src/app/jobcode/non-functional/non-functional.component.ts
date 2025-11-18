import { AfterViewChecked, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-non-functional',
  templateUrl: './non-functional.component.html',
  styleUrls: ['./non-functional.component.sass']
})
export class NonFunctionalComponent implements OnInit {

selectedCategory: string = 'Sweet Boondi';
  selectedItems: string[] = [];

  boondiCategories = [
    {
      name: 'Sweet Boondi',
      items: [
        'Plain Sweet Boondi', 'Motichoor Boondi', 'Kesar Boondi', 'Rose Boondi', 'Bellam Boondi',
        'Coconut Boondi', 'Chocolate Boondi', 'Honey Boondi', 'Kobbari-Kesar Boondi',
        'Dry Sweet Boondi', 'Cardamom Boondi', 'Almond Boondi', 'Vanilla Boondi', 'Mango Boondi',
        'Mixed Nut Boondi', 'Ghee Fried Boondi', 'Kesar Motichoor', 'Tutti Frutti Boondi',
        'Jaggery Boondi', 'Milk Boondi'
      ]
    },
    {
      name: 'Spicy / Namkeen Boondi',
      items: [
        'Masala Boondi', 'Kara Boondi', 'Jeera Boondi', 'Garlic Boondi', 'Mint Boondi',
        'Pepper Boondi', 'Lemon Boondi', 'Onion Boondi', 'Hing Boondi', 'Mirchi Boondi',
        'Chaat Masala Boondi', 'Peri-Peri Boondi', 'Tandoori Boondi', 'Curry Leaf Boondi',
        'Green Chutney Boondi', 'Mustard Boondi', 'Coriander Boondi', 'Sesame Boondi',
        'Peanut Boondi', 'Ginger Boondi'
      ]
    },
    {
      name: 'Regional & Festival Boondi',
      items: [
        'Bonalu Boondi', 'Bathukamma Boondi', 'Ugadi Boondi', 'Dasara Boondi', 'Sankranti Boondi',
        'Temple Prasadam Boondi', 'Hyderabad Style Boondi', 'Warangal Style Boondi',
        'Nalgonda Style Boondi', 'Mahbubnagar Style Boondi', 'Karimnagar Boondi',
        'Tribal Honey Boondi', 'Coastal Coconut Boondi', 'Red Rice Boondi', 'Millet Boondi',
        'Palm Jaggery Boondi', 'Village Boondi', 'Deccan Spicy Boondi', 'Halwai Style Boondi', 'Market Boondi'
      ]
    },
    {
      name: 'Fusion & Modern Boondi',
      items: [
        'Chocolate-Coconut Boondi', 'Cheese Masala Boondi', 'Pizza Boondi', 'Wasabi Boondi',
        'Maple-Jaggery Boondi', 'Peanut Butter Boondi', 'Honey-Sesame Boondi', 'Sriracha Boondi',
        'Olive Oil Boondi', 'Truffle Salt Boondi', 'Avocado Boondi', 'Greek Yogurt Boondi',
        'Chocolate-Chili Boondi', 'Matcha Boondi', 'Coffee Boondi', 'Blueberry Boondi',
        'Caramel Boondi', 'Nutella Boondi', 'Paprika Boondi', 'Energy Boondi'
      ]
    },
    {
      name: 'Raita & Kadhi Boondi',
      items: [
        'Raita Boondi', 'Mint Raita Boondi', 'Curd Boondi', 'Kadhi Boondi', 'Dal Topping Boondi',
        'Salad Topping Boondi', 'Chaat Topping Boondi', 'Soup Boondi', 'Biryani Boondi', 'Instant Snack Boondi'
      ]
    },
    {
      name: 'Laddu & Mix Varieties',
      items: [
        'Boondi Laddu', 'Motichoor Laddu', 'Jaggery Laddu', 'Dry Boondi Mix', 'Chivda Mix',
        'Sweet & Savoury Mix', 'Trail Mix Boondi', 'Nutrient Boondi', 'Gift Box Boondi',
        'Sugar-Free Boondi', 'Baked Boondi', 'Boondi Barfi', 'Energy Ball Boondi', 'Fry Mix Boondi',
        'Shelf Boondi', 'Mini Snack Boondi', 'Family Boondi', 'Festival Boondi', 'Seasonal Boondi'
      ]
    }
  ];

  ngOnInit() {
    this.selectCategory(this.selectedCategory);
  }

  selectCategory(categoryName: string) {
    this.selectedCategory = categoryName;
    const category = this.boondiCategories.find(c => c.name === categoryName);
    this.selectedItems = category ? category.items : [];
  }

  rajender(item:any) {
    Swal.fire({
      icon: 'success',
      title:`${item} is ordered successfully`
    })
  }
}
