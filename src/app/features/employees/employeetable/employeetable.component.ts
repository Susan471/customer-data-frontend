import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
} from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import {
  MatSort,
  MatSortModule,
} from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { HostListener } from '@angular/core';
import { MatCard } from '@angular/material/card';

import { AuthService } from '../../../core/service/auth.service';
import { EmployeeService } from '../../../core/service/employee.service';
import { ToastService } from '../../../core/service/toast.service';
import { Employee } from 'src/app/core/models/models/employee.model';

export type EmpFilterKey =
  | 'empCode'
  | 'empName'
  | 'empEmailId'
  | 'empPhoneno';

@Component({
  selector: 'app-employeetable',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltip,
    MatCard,
  ],

  templateUrl: './employeetable.component.html',
  styleUrls: ['./employeetable.component.css'],
})
export class EmployeetableComponent
  implements OnInit, AfterViewInit
{
  displayedColumns: string[] = [
    'empCode',
    'empName',
    'empPhoneno',
    'empEmailId',
    'action',
  ];
  dataSource: MatTableDataSource<Employee> =
    new MatTableDataSource<Employee>();

  filterValues: {
    empCode: string;
    empName: string;
    empEmailId: string;
    empPhoneno: string;
    global: string;
  } = {
    empCode: '',
    empName: '',
    empEmailId: '',
    empPhoneno: '',
    global: '',
  };

  filteredColumns = {
    empCode: false,
    empName: false,
    empEmailId: false,
    empPhoneno: false,
  };
  sortedColumns: {
    [key in EmpFilterKey]?: 'asc' | 'desc' | '';
  } = {
    empCode: '',
    empName: '',
    empEmailId: '',
    empPhoneno: '',
  };

  filterBoxTop: number = 0;
  filterBoxLeft: number = 0;

  activeColumnFilter: EmpFilterKey | null = null;

  columnLabelMap: Record<EmpFilterKey, string> = {
    empCode: 'Code',
    empName: 'Name',
    empPhoneno: 'Phone',
    empEmailId: 'Email',
  };

  username: string | null = '';
  loggedInEmpCode: string = '';

  private skipSavedFilterOnce = false;
  inputFocused = false;

  @ViewChild('commonFilterBox')
  commonFilterBox!: ElementRef;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChildren('filterInput')
  filterInputs!: QueryList<ElementRef>;

  private employeeService = inject(EmployeeService);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  //***DATA + CONFIGURATION***//
  ngOnInit(): void {
    this.dataSource.filterPredicate = (
      data: Employee,
      filter: string,
    ): boolean => {
      const searchItems = JSON.parse(filter); //string to object conversion

      const columnMatch =
        (!searchItems.empCode ||
          (data.empCode ?? '')
            .toLowerCase()
            .includes(searchItems.empCode.toLowerCase())) &&
        (!searchItems.empName ||
          (data.empName ?? '')
            .toLowerCase()
            .includes(searchItems.empName.toLowerCase())) &&
        (!searchItems.empEmailId ||
          (data.empEmailId ?? '')
            .toLowerCase()
            .includes(
              searchItems.empEmailId.toLowerCase(),
            )) &&
        (!searchItems.empPhoneno ||
          (data.empPhoneno ?? '')
            .toLowerCase()
            .includes(
              searchItems.empPhoneno.toLowerCase(),
            ));

      const globalMatch =
        !searchItems.global ||
        (data.empCode ?? '')
          .toLowerCase()
          .includes(searchItems.global) ||
        (data.empName ?? '')
          .toLowerCase()
          .includes(searchItems.global) ||
        (data.empEmailId ?? '')
          .toLowerCase()
          .includes(searchItems.global) ||
        (data.empPhoneno ?? '')
          .toLowerCase()
          .includes(searchItems.global);

      const isMatch = globalMatch && columnMatch;

      if (isMatch) {
        console.log(
          'Matched row :',
          data,
          'Filter:',
          searchItems,
        );
      }
      return isMatch;
    };

    this.dataSource.sortingDataAccessor = (
      item: Employee,
      property: string,
    ) => {
      switch (property) {
        case 'empCode':
          return (item.empCode ?? '').toLowerCase();
        case 'empName':
          return (item.empName ?? '').toLowerCase();
        case 'empEmailId':
          return (item.empEmailId ?? '').toLowerCase();
        case 'empPhoneno':
          return (item.empPhoneno ?? '').toLowerCase();
        default:
          return '';
      }
    };
    //This block is used to NATURAL SORT (ex). emp1-->emp2-->emp10 without this emp1-->emp10-->emp2
    this.dataSource.sortData = (
      data: Employee[],
      sort: MatSort,
    ) => {
      if (!sort.active || sort.direction === '')
        return data;

      return data.sort((a, b) => {
        const valueA = (a as any)[sort.active] ?? '';
        const valueB = (b as any)[sort.active] ?? '';

        const comparison = valueA
          .toString()
          .localeCompare(valueB.toString(), undefined, {
            numeric: true,
            sensitivity: 'base',
          });

        return sort.direction === 'asc'
          ? comparison
          : -comparison;
      });
    };

    // Check if navigated from add form
    const navState = window.history.state;
    if (navState?.fromAdd) {
      this.skipSavedFilterOnce = true;
      window.history.replaceState({}, document.title);
    }

    this.getEmployees();
    // set the empCode
    this.loggedInEmpCode =
      localStorage.getItem('EmpCode') || '';
    console.log('Logged-in empCode:', this.loggedInEmpCode);
    //set username above the logout button
    this.authService.username$.subscribe((name) => {
      this.username = name;
    });
  }

  //*** TABLE SETUP ***//
  ngAfterViewInit(): void {
    // Assign paginator and sort to the dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe((state) => {
      //  First remove old highlights
      Object.keys(this.sortedColumns).forEach((key) => {
        this.sortedColumns[key as EmpFilterKey] = '';
      });

      //  Set highlight for newly sorted column
      if (state.direction && state.active) {
        this.sortedColumns[state.active as EmpFilterKey] =
          state.direction;
      }

      //  Refresh paginator
      this.refreshPaginator();
    });
  }

  //*** USER TRIGGERED FUNCTIONS WHEN CLICK BUTTONS  ***///

  //if click plus icon redirect add form
  gotoAdd() {
    this.router.navigate(['/add']);
  }

  //logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  //edit employee
  editEmployee(empCode: string): void {
    // Find employee in the current dataSource by empCode
    const emp = this.dataSource.data.find(
      (e) => e.empCode === empCode,
    );

    if (!emp) {
      this.toast.showError('Employee not found!');
      return;
    }

    // Navigate using the employee ID
    this.router.navigate(['/edit', emp.id]);
  }

  deleteEmployee(empCode: string): void {
    console.log('Clicked empCode:', empCode);
    console.log('Logged-in empCode:', this.loggedInEmpCode);

    if (
      empCode.trim().toLowerCase() ===
      this.loggedInEmpCode.trim().toLowerCase()
    ) {
      this.toast.showError(
        'You Cannot delete your own account while logged in',
      );
      return;
    }

    this.toast.showConfirm(
      'Are you sure you want to delete this employee?',
      () => {
        this.employeeService
          .deleteEmployee(empCode)
          .subscribe({
            next: (res) => {
              this.dataSource.data =
                this.dataSource.data.filter(
                  (emp) => emp.empCode !== empCode,
                );
              this.refreshPaginator();

              this.toast.showSuccess(
                'Employee Deleted Successfully',
              );

              console.log(res);
            },
            error: (err) => {
              this.toast.showError(
                'Employee Delete Failed.Try again',
              );

              console.error('Delete Failed', err);
            },
          });
      },
    );
  }

  resetAll() {
    this.filterValues = {
      empCode: '',
      empName: '',
      empEmailId: '',
      empPhoneno: '',
      global: '',
    };
    // clear column filter highlights
    this.filteredColumns = {
      empCode: false,
      empName: false,
      empEmailId: false,
      empPhoneno: false,
    };

    this.filterInputs.forEach((input) => {
      input.nativeElement.value = '';
    });

    this.dataSource.filter = JSON.stringify(
      this.filterValues,
    );

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.activeColumnFilter = null;

    if (!this.sort) {
      console.warn('MatSort is not ready yet!');
      return;
    }

    // Clear sort highlight tracking
    Object.keys(this.sortedColumns).forEach((key) => {
      this.sortedColumns[key as EmpFilterKey] = '';
    });

    //  Default data sort (empCode ASC)
    const sortedData = [...this.dataSource.data].sort(
      (a, b) =>
        (a.empCode ?? '').localeCompare(b.empCode ?? ''),
    );
    this.dataSource.data = sortedData;
    console.log(
      'Filtered data before sort:',
      this.dataSource.filteredData,
    );
    // Clear MatSort UI state
    this.sort.active = '';
    this.sort.direction = '';
    this.sort.sortChange.emit({
      active: '',
      direction: '',
    }); // IMPORTANT
    this.dataSource.sort = this.sort;
  }

  saveFilterState() {
    // find sorted column

    const sortState = this.sort?.active
      ? {
          column: this.sort.active,
          direction: this.sort.direction,
        }
      : null;
    const payload = {
      filterState: {
        filterState: this.filterValues, // your filters
        sortState: sortState, // sort info
      },
    };

    this.employeeService
      .saveFilterState(payload)
      .subscribe({
        next: () =>
          this.toast.showSuccess(
            'Filter & Sort values saved successfully!!!',
          ),
        error: () =>
          this.toast.showError(
            'Failed to save Filter & Sort!Please try again..',
          ),
      });
  }

  //*** FILTER STATE FUNCTIONS  ***/

  applyFilter(event: Event) {
    if (!this.filterValues) {
      this.filterValues = {
        empCode: '',
        empName: '',
        empEmailId: '',
        empPhoneno: '',
        global: '',
      };
    }

    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filterValues.global = value;

    this.dataSource.filter = JSON.stringify(
      this.filterValues,
    );
    this.refreshPaginator();
  }

  //column vise filter

  applyColumnFilter(column: EmpFilterKey, event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();

    this.filterValues[column] = value;

    this.filteredColumns[column] = value.length > 0;

    this.dataSource.filter = JSON.stringify(
      this.filterValues,
    );
    this.refreshPaginator();
  }

  openColumnFilter(
    column: EmpFilterKey,
    event?: MouseEvent,
  ) {
    console.log('Filter clicked for column:', column);
    // Toggle filter for same column
    if (this.activeColumnFilter === column) {
      this.activeColumnFilter = null;
      return;
    }

    this.activeColumnFilter = column;

    if (event) {
      const thElement = (
        event.target as HTMLElement
      ).closest('th');
      if (thElement) {
        const rect = thElement.getBoundingClientRect();
        this.filterBoxTop =
          rect.bottom + window.scrollY + 5;
        this.filterBoxLeft = rect.left + window.scrollX;
      }
    }

    // Focus input
    setTimeout(() => {
      const inputE1 = this.filterInputs?.find(
        (e1) =>
          e1.nativeElement.getAttribute('data-column') ===
          column,
      )?.nativeElement;

      if (inputE1) {
        inputE1.focus();
        inputE1.value = this.filterValues[column];
      }
    });
  }
  sortColumn(direction: 'asc' | 'desc') {
    if (!this.activeColumnFilter || !this.sort) return;

    // Set active column
    const column = this.activeColumnFilter;

    // Set MatSort state
    this.sort.active = column;
    this.sort.direction = direction;
    this.sort._stateChanges.next();
    this.dataSource.sort = this.sort;

    //  UPDATE HIGHLIGHT STATE
    Object.keys(this.sortedColumns).forEach((key) => {
      this.sortedColumns[key as EmpFilterKey] = '';
    });

    // Set direction directly
    this.sort.direction = direction;

    this.sortedColumns[column] = direction;

    this.refreshPaginator();
  }
  resetColumnFilter(column: EmpFilterKey) {
    if (!column) return;

    // Clear filter value
    this.filterValues[column] = '';

    //  Remove highlight
    this.filteredColumns[column] = false;

    //  Clear input box UI
    const input = this.filterInputs.find(
      (el) =>
        el.nativeElement.getAttribute('data-column') ===
        column,
    );
    if (input) {
      input.nativeElement.value = '';
    }

    //  Apply updated filter
    this.dataSource.filter = JSON.stringify(
      this.filterValues,
    );
    this.refreshPaginator();

    // If current sort column is same → reset sort
    if (this.sort.active === column) {
      this.sort.active = '';
      this.sort.direction = '';
      this.sort.sortChange.emit({
        active: '',
        direction: '',
      });
    }
  }

  toggleFilter(column: EmpFilterKey) {
    this.activeColumnFilter =
      this.activeColumnFilter === column ? null : column;
  }

  //** BACKEND FUNCTIONS  **//

  getEmployees(fromAdd?: boolean): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log(this.dataSource);
        if (this.skipSavedFilterOnce) {
          this.resetToDefaultView(); // only once
          this.skipSavedFilterOnce = false;
        } else {
          this.loadSavedFilter(); // always restore saved state otherwise
        }
      },
      error: (err) => console.error(err),
    });
  }
  loadSavedFilter() {
    this.employeeService.getSaveFilterStaet().subscribe({
      next: (res) => {
        if (!res || !res[0].filterState) return;

        const saved = res[0].filterState; // saved contains { filterState, sortState }

        // Assign filterValues safely
        this.filterValues = {
          empCode: saved.filterState.empCode ?? '',
          empName: saved.filterState.empName ?? '',
          empEmailId: saved.filterState.empEmailId ?? '',
          empPhoneno: saved.filterState.empPhoneno ?? '',
          global: saved.filterState.global ?? '',
        };

        const sortState = saved.sortState;

        // Restore filter highlights
        this.filteredColumns = {
          empCode: !!this.filterValues.empCode,
          empName: !!this.filterValues.empName,
          empEmailId: !!this.filterValues.empEmailId,
          empPhoneno: !!this.filterValues.empPhoneno,
        };

        // Restore input box values
        setTimeout(() => {
          this.filterInputs.forEach((input) => {
            const col =
              input.nativeElement.getAttribute(
                'data-column',
              );
            if (
              col &&
              this.filterValues[col as EmpFilterKey] !==
                undefined
            ) {
              input.nativeElement.value =
                this.filterValues[col as EmpFilterKey];
            }
          });
        });

        // Apply filter to table
        this.dataSource.filter = JSON.stringify(
          this.filterValues,
        );

        // Restore sort highlights if any
        if (sortState && this.sort) {
          setTimeout(() => {
            this.sort.active = sortState.column;
            this.sort.direction = sortState.direction;
            this.sort.sortChange.emit({
              active: sortState.column,
              direction: sortState.direction,
            });
          });
        }

        // Move to first page
        if (this.paginator) {
          this.dataSource.paginator?.firstPage();
        }
      },
      error: (err) => {
        console.error('Failed to load filter', err);
        this.toast.showError('Failed to load filter');
      },
    });
  }

  // RESET DEFAULT WHEN BACK FROM ADD FORM

  resetToDefaultView() {
    this.filterValues = {
      empCode: '',
      empName: '',
      empEmailId: '',
      empPhoneno: '',
      global: '',
    };

    this.dataSource.filter = JSON.stringify(
      this.filterValues,
    );
    this.refreshPaginator();

    setTimeout(() => {
      this.sort.active = 'empCode';
      this.sort.direction = 'asc';
      this.sort.sortChange.emit({
        active: 'empCode',
        direction: 'asc',
      });
    });
  }
  // REFRESH PAGINATOR
  private refreshPaginator() {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // GLOBAL LISTENERS
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.activeColumnFilter) return;

    const clickedElement = event.target as HTMLElement;

    // Check if click is inside filter box
    const isInsideFilterBox =
      this.commonFilterBox?.nativeElement.contains(
        clickedElement,
      );

    // Check if click is on any filter icon
    const isFilterButton =
      clickedElement.classList.contains('filter-btn');

    // If click is outside both → close the filter box
    if (!isInsideFilterBox && !isFilterButton) {
      this.activeColumnFilter = null;
    }
  }
}
