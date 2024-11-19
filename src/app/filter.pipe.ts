import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, key: string = 'username'): any[] {
    if (!items) return [];
    if (!searchTerm) return items;

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      const value = item[key]?.toString().toLowerCase(); // Safe access and convert to string
      return value && value.includes(searchTerm); // Check for existence before includes
    });
  }
}