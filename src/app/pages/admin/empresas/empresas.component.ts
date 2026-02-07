import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  empresaForm!: FormGroup;
  sucursalForm!: FormGroup;

  lineas!: FormArray;

  botonGuardar: boolean = true;
  currentStep: number = 1;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {

    // ===== FORM EMPRESA =====
    this.empresaForm = this.fb.group({
      usuarioSarah: ['', Validators.required],
      claveSarah: ['', Validators.required],
      rtn: ['', [Validators.required, Validators.minLength(14)]],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      representanteLegal: ['', Validators.required]
    });

    // ===== FORM SUCURSAL =====
    this.sucursalForm = this.fb.group({
      idsucursal: ['', Validators.required],
      sucursal: ['', Validators.required],
      direccionSucursal: ['', Validators.required]
    });

    // ===== TABLA =====
    this.lineas = this.fb.array([]);
  }

  // ===== WIZARD =====
  goToStep(step: number): void {
    this.currentStep = step;
  }

  // ===== EMPRESA =====
  accionBotonEmpresa(): void {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      return;
    }

    const campos = Object.keys(this.empresaForm.controls);

    if (this.botonGuardar) {
      campos.forEach(c => this.empresaForm.get(c)?.disable());
      this.botonGuardar = false;
      console.log('Empresa guardada:', this.empresaForm.getRawValue());
    } else {
      campos.forEach(c => this.empresaForm.get(c)?.enable());
      this.botonGuardar = true;
    }
  }

  // ===== SUCURSAL =====
  accionBotonSucursal(): void {
    if (this.sucursalForm.invalid) {
      this.sucursalForm.markAllAsTouched();
      return;
    }

    this.lineas.push(
      this.fb.group({
        numeroLinea: this.sucursalForm.value.idsucursal,
        cantidadUnidades: this.sucursalForm.value.sucursal,
        pesoAfectado: this.sucursalForm.value.direccionSucursal
      })
    );

    this.sucursalForm.reset();
  }

  // ===== TABLA =====
  borrarLinea(index: number): void {
    this.lineas.removeAt(index);
  }



}
