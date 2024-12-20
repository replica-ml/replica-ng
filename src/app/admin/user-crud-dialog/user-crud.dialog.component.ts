import { Component, Inject, OnInit, Optional } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IUser } from "../../api/user/user.interfaces";


@Component({
    selector: 'app-admin.user-crud',
    templateUrl: './user-crud.dialog.component.html',
    styleUrls: ['./user-crud.dialog.component.css'],
    standalone: false
})
export class UserCrudDialogComponent implements OnInit {
  static roles: string[] = ['registered', 'login', 'admin'];
  roles = UserCrudDialogComponent.roles;
  form: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.minLength(3)),
    roles: new UntypedFormControl('', Validators.required)
  });
  default_roles = UserCrudDialogComponent.roles.slice(0, 2);
  destroy = false;

  constructor(public dialogRef: MatDialogRef<UserCrudDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: IUser) {
  }

  ngOnInit() {
    if (this.data === null)
      this.form.patchValue({ roles: this.default_roles });
    else {
      this.form.patchValue(this.data);
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].disable();
    }
  }

  closeDialog() {
    this.dialogRef.close(this.destroy ? this.destroy : this.form.value);
  }
}
