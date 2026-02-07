import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-duca-rg',
  templateUrl: './duca-rg.component.html'
})
export class DucaRgComponent {
  aduanas = ['001- ADUANA LA MESA', '002- ADUANA TOCNCONTIN'];

  regimenesAduaneros = [
    '4000-IMPORTACION DEFINITIVA CANCELA TITULO DE TRANSPORTE'
  ];

  tiposItem = [
    { value: 'D', label: 'Materia Prima' },
    { value: 'G', label: 'Producto Terminado' },
    { value: 'N', label: 'Normal' }
  ];

  estadosMercancia = [
    { value: 'AV', label: 'Averiadas' },
    { value: 'CO', label: 'Congelados' },
    { value: 'DE', label: 'Desarmadas' },
    { value: 'DM', label: 'Desmontadas' }
  ];

  formasPago = [
    'BP - CHEQUE BANCARIO',
    'CC - CARTA DE CREDITO',
    'EF - EFECTIVO',
    'GB - GIRO BANCARIO',
    'OT - OTRO',
    'TB - TRANSFERENCIA BANCARIA'
  ];

  condicionesEntrega = ['FOB - LIBRE PUESTA A BORDO'];

  paises = [
    { value: 'AD', label: 'AD - ANDORRA' },
    { value: 'AF', label: 'AF - AFGANISTAN' },
    { value: 'CN', label: 'CN - CHINA' },
    { value: 'CR', label: 'CR - Costa Rica' },
    { value: 'GT', label: 'GT - Guatemala' },
    { value: 'HN', label: 'HN - Honduras' },
    { value: 'NI', label: 'NI - Nicaragua' },
    { value: 'PA', label: 'PA - Panamá' },
    { value: 'SV', label: 'SV - El Salvador' }
  ];

  cuotasArancelarias = [
    { value: '1', label: '01 - Cuota 01' },
    { value: '2', label: '02 - Cuota 02' },
    { value: '3', label: '03 - Cuota 03' }
  ];

  unidadesComerciales = [
    { value: '1', label: '01 - KILOGRAMO NETO' },
    { value: '2', label: '02 - METRO CUADRADO' },
    { value: '3', label: '03 - METRO' },
    { value: '4', label: '04 - TONELADA MÉTRICA' },
    { value: '6', label: '06 - PAR' },
    { value: '7', label: '07 - DOCENA' },
    { value: '8', label: '08 - TONELADA BRUTA' },
    { value: '9', label: '09 - CENTILITOR ALC PURO' },
    { value: '18', label: '18 - PIEZA' }
  ];

  unidadesEstadisticas = [{ value: '15', label: '15 - UNIDAD' }];

  ducaForm: FormGroup;
  bultosForm: FormGroup;
  lineaForm: FormGroup;
  itemForm: FormGroup;

  lineas: any[] = [];
  lineasFiltradas: any[] = [];
  cantidadVisible: number = 15;
  currentStep: number = 1;

  selectedCuotaArancelaria = this.cuotasArancelarias[0].value;
  selectedUnidadComercial = this.unidadesComerciales[0].value;
  selectedUnidadEstadistica = this.unidadesEstadisticas[0].value;

  cantidadComercial: number = 0;
  cantidadEstadistica: number = 0;
  importeFactura: number = 0;
  importeOtrosGastos: number = 0;
  importeSeguro: number = 0;

    // Estados de la DUCA
  estadoDuca: 'N' | 'T' | 'V' | 'R' = 'N';
  iddtTemporal: string | null = null;
  iddtDefinitivo: string | null = null;


  loading = false;
  iddtActual: string | null = null;

constructor(private fb: FormBuilder) {
  this.ducaForm = this.fb.group({
    declarante: [{ value: 'USUARIO AUTENTICADO', disabled: true }],
    aduanaDespacho: ['', Validators.required],
    regimenAduanero: ['', Validators.required],
    rtnImportadorExportador: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
    importadorExportador: [{ value: '', disabled: true }],
    rtnAgenciaAduanera: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
    agenciaAduanera: [{ value: '', disabled: true }],
    idManifiestoEntregaRapida: ['', Validators.required],
    nombreProveedorDestinatario: ['', Validators.required],
    contratoProveedorDestinatario: ['', Validators.required],
    domicilioProveedor: ['', Validators.required],
    numeroPreimpreso: ['', Validators.required],
    entidadMediacion: ['', Validators.required],
    depositoAlmacenamiento: ['', Validators.required],
    aduanaIngresoSalida: ['', Validators.required],
    paisOrigen: ['', Validators.required],
    formaPago: ['', Validators.required],
    condicionEntrega: ['', Validators.required],
    observaciones: ['', [Validators.required, Validators.maxLength(300)]],
  });

  this.bultosForm = this.fb.group({
    manifiesto: ['', Validators.required],
    tituloTransporte: ['', Validators.required],
    indicadorCancelacion: ['', Validators.required]
  });

  this.lineaForm = this.fb.group({
    numeroLinea: ['', Validators.required],
    cantidadUnidades: ['', Validators.required],
    pesoAfectado: ['', Validators.required]
  });

  this.itemForm = this.fb.group({
    numeroItem: ['', [Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
    tipoItem: ['', Validators.required],
    posicionArancelaria: ['', [Validators.required, Validators.maxLength(16), Validators.pattern('^[0-9.]*$')]],
    tituloManifiesto: ['', [Validators.required, this.validateUppercase]],
    idMatrizInsumos: ['', [Validators.required, this.validateUppercase]],
    numeroItemAsociado: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    declaracionCancelar: ['', [Validators.required, this.validateUppercase]],
    numeroItemCancelar: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    pesoNetoKilos: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    pesoBrutoKilos: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    cantidadBultos: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    estadoMercancia: ['', Validators.required],
    paisOrigen: ['', Validators.required],
    paisProcedencia: ['', Validators.required],
    paisAdquisicion: ['', Validators.required],
    cuotaArancelaria: ['', Validators.required],
    unidadComercial: ['', Validators.required],
    cantidadComercial: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    unidadEstadistica: ['', Validators.required],
    cantidadEstadistica: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    importeFactura: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    importeOtrosGastos: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    importeSeguro: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    importeFlete: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    ajusteIncluir: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    nroCertificadoImportacion: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    convenioPerfeccionado: ['', [Validators.required, this.validateUppercase]],
    exoneracionAduanera: ['', [Validators.required, this.validateUppercase]],
    descripcion: ['', [Validators.required, this.validateUppercase]],
    comentario: ['', [Validators.required, this.validateUppercase]],
  });
}

// =============================
// ESTADO DE CARGA Y CONTROL
// =============================
//loading = false;
//iddtActual: string | null = null; // ID temporal o definitivo de la DUCA

// =============================
// GUARDAR DUCA EN BACKEND
// =============================
crearDuca(): void {
  if (!this.ducaForm.valid) {
    alert('Por favor, complete los campos obligatorios antes de guardar.');
    return;
  }

  this.loading = true;

  const ducaData = {
    generales: this.ducaForm.getRawValue(),
    bultos: this.bultosForm.getRawValue(),
    lineas: this.lineas,
    items: this.itemForm.getRawValue(),
  };

  console.log('Datos a enviar al backend:', ducaData);

  fetch('http://localhost:3000/api/duca/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ducaData)
  })
    .then(async res => {
      this.loading = false;
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      this.iddtActual = data.iddtInt || data.iddt;

      // Estado Temporal
      this.estadoDuca = 'T';
      this.iddtTemporal = this.iddtActual;

      alert('✅ DUCA guardada correctamente en base de datos.');

    })
    .catch(err => {
      this.loading = false;
      console.error('Error al guardar DUCA:', err);
      alert('❌ Error al guardar DUCA. Revise la consola.');
    });
}

// =============================
// GENERAR Y DESCARGAR XML
// =============================
generarXml(): void {
  if (!this.iddtActual) {
    alert('Primero debe guardar la DUCA antes de generar el XML.');
    return;
  }

  this.loading = true;
  const url = `http://localhost:3000/api/duca/generar-xml/${this.iddtTemporal}`;

  fetch(url)
    .then(async res => {
      this.loading = false;
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${this.iddtActual}.xml`;
      link.click();
      URL.revokeObjectURL(link.href);
      alert('📄 XML generado y descargado correctamente.');
    })
    .catch(err => {
      this.loading = false;
      console.error('Error al generar XML:', err);
      alert('❌ Error al generar XML. Revise la consola.');
    });
}


  // --- CONTROL DEL FLUJO UI ---

  ngOnInit(): void {
    this.actualizarLineasFiltradas();
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  submitBultos(): void {
    if (this.bultosForm.valid) {
      console.log('Formulario de Bultos:', this.bultosForm.value);
    }
  }

  addLinea(): void {
    if (this.lineaForm.valid) {
      this.lineas.push(this.lineaForm.value);
      this.lineaForm.reset();
      this.actualizarLineasFiltradas();
    }
  }

  guardarLinea(index: number): void {
    console.log('Guardando línea:', this.lineas[index]);
  }

  editarLinea(index: number): void {
    console.log('Editando línea:', this.lineas[index]);
  }

  borrarLinea(index: number): void {
    this.lineas.splice(index, 1);
    this.actualizarLineasFiltradas();
  }

  validateNumericInput(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  buscarLinea(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.lineasFiltradas = this.lineas.filter(linea =>
      Object.values(linea).some(value =>
        value.toString().toLowerCase().includes(query)
      )
    );
  }

  cambiarCantidad(event: Event): void {
    this.cantidadVisible = parseInt((event.target as HTMLSelectElement).value, 10);
    this.actualizarLineasFiltradas();
  }

  actualizarLineasFiltradas(): void {
    this.lineasFiltradas = this.lineas.slice(0, this.cantidadVisible);
  }

  validateUppercase(control: FormControl) {
    const value = control.value;
    if (value && value !== value.toUpperCase()) {
      return { uppercase: true };
    }
    return null;
  }
}


// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// @Component({
//   selector: 'app-duca-rg',
//   templateUrl: './duca-rg.component.html'
// })
// export class DucaRgComponent {
//   aduanas = ['001- ADUANA LA MESA', '002- ADUANA TOCNCONTIN'];
//   regimenesAduaneros = ['4000-IMPORTACION DEFINITIVA CANCELA TITULO DE TRANSPORTE'];
//   tiposItem = [
//     { value: 'D', label: 'Materia Prima' },
//     { value: 'G', label: 'Producto Terminado' },
//     { value: 'N', label: 'Normal' }
//   ];

//   estadosMercancia = [
//     { value: 'AV', label: 'Averiadas' },
//     { value: 'CO', label: 'Congelados' },
//     { value: 'DE', label: 'Desarmadas' },
//     { value: 'DM', label: 'Desmontadas' }
//   ];

// //  paises = ['AD - ANDORRA', 'AF - AFGANISTAN', 'CN - CHINA', 'HN - HONDURAS'];
//   formasPago = ['BP - CHEQUE BANCARIO', 'CC - CARTA DE CREDITO', 'EF - EFECTIVO', 'GB - GIRO BANCARIO', 'OT - OTRO', 'TB - TRANSFERENCIA BANCARIA'];
//   condicionesEntrega = ['FOB - LIBRE PUESTA A BORDO'];
//   paises = [
//   { value: 'AD', label: 'AD - ANDORRA' },
//   { value: 'AF', label: 'AF - AFGANISTAN' },
//   { value: 'CN', label: 'CN - CHINA' },
//   { value: 'CR', label: 'CR - Costa Rica' },
//   { value: 'GT', label: 'GT - Guatemala' },
//   { value: 'HN', label: 'HN - Honduras' },
//   { value: 'NI', label: 'NI - Nicaragua' },
//   { value: 'PA', label: 'PA - Panamá' },
//   { value: 'SV', label: 'SV - El Salvador' }
//   ];

//   cuotasArancelarias = [
//     { value: '1', label: '01 - Cuota 01' },
//     { value: '2', label: '02 - Cuota 02' },
//     { value: '3', label: '03 - Cuota 03' }
//   ];

//   unidadesComerciales = [
//     { value: '1', label: '01 - KILOGRAMO NETO' },
//     { value: '2', label: '02 - METRO CUADRADO' },
//     { value: '3', label: '03 - METRO' },
//     { value: '4', label: '04 - TONELADA MÉTRICA' },
//     { value: '6', label: '06 - PAR' },
//     { value: '7', label: '07 - DOCENA' },
//     { value: '8', label: '08 - TONELADA BRUTA' },
//     { value: '9', label: '09 - CENTILITOR ALC PURO' },
//     { value: '18', label: '18 - PIEZA' }
//   ];

//   unidadesEstadisticas = [
//     { value: '15', label: '15 - UNIDAD' }
//   ];


//   ducaForm: FormGroup;
//   bultosForm: FormGroup;
//   lineaForm: FormGroup;
//   itemForm: FormGroup;
//   lineas: any[] = []; // Lista de líneas
//   lineasFiltradas: any[] = []; // Líneas filtradas para mostrar en la tabla
//   cantidadVisible: number = 15; // Cantidad de registros visibles
//   currentStep: number = 1;

//   // Selected values
//   //selectedPaisAdquisicion = this.paises[0].value;
//   selectedCuotaArancelaria = this.cuotasArancelarias[0].value;
//   selectedUnidadComercial = this.unidadesComerciales[0].value;
//   selectedUnidadEstadistica = this.unidadesEstadisticas[0].value;

//   // Numeric fields
//   cantidadComercial: number = 0;
//   cantidadEstadistica: number = 0;
//   importeFactura: number = 0;
//   importeOtrosGastos: number = 0;
//   importeSeguro: number = 0;

//   constructor(private fb: FormBuilder) {
//     this.ducaForm = this.fb.group({
//       declarante: [{ value: 'USUARIO AUTENTICADO', disabled: true }],
//       aduanaDespacho: ['', Validators.required],
//       regimenAduanero: ['', Validators.required],
//       rtnImportadorExportador: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
//       importadorExportador: [{ value: '', disabled: true }],
//       rtnAgenciaAduanera: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
//       agenciaAduanera: [{ value: '', disabled: true }],
//       idManifiestoEntregaRapida: ['', Validators.required],
//       nombreProveedorDestinatario: ['', Validators.required],
//       contratoProveedorDestinatario: ['', Validators.required],
//       domicilioProveedor: ['', Validators.required],
//       numeroPreimpreso: ['', Validators.required],
//       entidadMediacion: ['', Validators.required],
//       depositoAlmacenamiento: ['', Validators.required],
//       aduanaIngresoSalida: ['', Validators.required],
//       paisOrigen: ['', Validators.required],
//       formaPago: ['', Validators.required],
//       condicionEntrega: ['', Validators.required],
//       observaciones: ['', [Validators.required, Validators.maxLength(300)]],
//     });

//     this.bultosForm = this.fb.group({
//       manifiesto: ['', Validators.required],
//       tituloTransporte: ['', Validators.required],
//       indicadorCancelacion: ['', Validators.required]
//     });

//     this.lineaForm = this.fb.group({
//       numeroLinea: ['', Validators.required],
//       cantidadUnidades: ['', Validators.required],
//       pesoAfectado: ['', Validators.required]
//     });

//     this.itemForm = this.fb.group({
//       numeroItem: ['', [Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
//       tipoItem: ['', Validators.required],
//       posicionArancelaria: ['', [Validators.required, Validators.maxLength(16), Validators.pattern('^[0-9.]*$')]],
//       tituloManifiesto: ['', [Validators.required, this.validateUppercase]],
//       idMatrizInsumos: ['', [Validators.required, this.validateUppercase]],
//       numeroItemAsociado: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       declaracionCancelar: ['', [Validators.required, this.validateUppercase]],
//       numeroItemCancelar: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       pesoNetoKilos: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       pesoBrutoKilos: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       cantidadBultos: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       estadoMercancia: ['', Validators.required],
//       paisOrigen: ['', Validators.required],
//       paisProcedencia: ['', Validators.required],
//       paisAdquisicion: ['', Validators.required],
//       cuotaArancelaria: ['', Validators.required],
//       unidadComercial: ['', Validators.required],
//       cantidadComercial: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       unidadEstadistica: ['', Validators.required],
//       cantidadEstadistica: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       importeFactura: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       importeOtrosGastos: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       importeSeguro: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       importeFlete: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       ajusteIncluir: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       nroCertificadoImportacion: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       convenioPerfeccionado: ['', [Validators.required, this.validateUppercase]],
//       exoneracionAduanera: ['', [Validators.required, this.validateUppercase]],
//       descripcion: ['', [Validators.required, this.validateUppercase]],
//       comentario: ['', [Validators.required, this.validateUppercase]],
//     });
//   }

//   ngOnInit(): void {
//     this.actualizarLineasFiltradas();
//   }

//   goToStep(step: number): void {
//     this.currentStep = step;
//   }

//   submitBultos(): void {
//     if (this.bultosForm.valid) {
//       console.log('Formulario de Bultos:', this.bultosForm.value);
//     }
//   }

//   addLinea(): void {
//     if (this.lineaForm.valid) {
//       this.lineas.push(this.lineaForm.value);
//       this.lineaForm.reset();
//       this.actualizarLineasFiltradas();
//     }
//   }

//   guardarLinea(index: number): void {
//     console.log('Guardando línea:', this.lineas[index]);
//   }

//   editarLinea(index: number): void {
//     console.log('Editando línea:', this.lineas[index]);
//   }

//   borrarLinea(index: number): void {
//     this.lineas.splice(index, 1);
//     this.actualizarLineasFiltradas();
//   }

//   validateNumericInput(event: KeyboardEvent): void {
//     const charCode = event.key.charCodeAt(0);
//     if (charCode < 48 || charCode > 57) {
//       event.preventDefault();
//     }
//   }

//   buscarLinea(event: Event): void {
//     const query = (event.target as HTMLInputElement).value.toLowerCase();
//     this.lineasFiltradas = this.lineas.filter(linea =>
//       Object.values(linea).some(value =>
//         value.toString().toLowerCase().includes(query)
//       )
//     );
//   }

//   cambiarCantidad(event: Event): void {
//     this.cantidadVisible = parseInt((event.target as HTMLSelectElement).value, 10);
//     this.actualizarLineasFiltradas();
//   }

//   actualizarLineasFiltradas(): void {
//     this.lineasFiltradas = this.lineas.slice(0, this.cantidadVisible);
//   }

//   // Validation for uppercase strings
//   validateUppercase(control: FormControl) {
//     const value = control.value;
//     if (value && value !== value.toUpperCase()) {
//       return { uppercase: true };
//     }
//     return null;
//   }
// }