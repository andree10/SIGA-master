import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmpresaService } from '../../../../service/empresa.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuarioComponent implements OnInit {

  mostrarFormulario = true;
  botonGuardar = true;
  formActivo = false; // <-- formulario deshabilitado por defecto
  listaUsuarios: any[] = [];

  roles = ['Crear', 'Editar', 'Eliminar', 'Consulta'];
  todasSucursales: string[] = [];
  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder, private empresaService: EmpresaService) {
    this.usuarioForm = this.fb.group({
      idusuario: [''],
      identidad: [''],
      nombrecompleto: [''],
      cargo: [''],
      perfil: [''],
      rol: [[]],
      sucursales: [[]],
      email: [''],
      fechaInicio: [''],
      fechaFin: [''],
      foto: ['']
    });
  }

  ngOnInit(): void {
    this.empresaService.getSucursales().subscribe((sucursales: any[]) => {
      this.todasSucursales = sucursales.map(s => s.nombre);
    });
  }

  // Activar formulario al crear nuevo
  nuevoUsuario() {
    this.usuarioForm.reset({ rol: [], sucursales: [] });
    this.mostrarFormulario = true;
    this.botonGuardar = true;
    this.formActivo = true; // <-- habilitar inputs
  }

  // Activar formulario al editar
  editarUsuario(u: any) {
    this.usuarioForm.patchValue(u);
    this.mostrarFormulario = true;
    this.botonGuardar = false;
    this.formActivo = true; // <-- habilitar inputs
  }

  // Manejo de foto con vista previa
  onFotoChange(event: any) {
    if (!this.formActivo) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.usuarioForm.patchValue({ foto: reader.result });
      reader.readAsDataURL(file);
    }
  }

  // Toggle de roles
  toggleRol(e: any) {
    if (!this.formActivo) return;
    const rol = e.target.value;
    let selectedRoles = [...(this.usuarioForm.value.rol || [])];
    if (e.target.checked) selectedRoles.push(rol);
    else selectedRoles = selectedRoles.filter(r => r !== rol);
    this.usuarioForm.patchValue({ rol: selectedRoles });
  }

  // Agregar / quitar sucursales
  agregarSucursal(s: string) {
    if (!this.formActivo) return;
    const seleccionadas = [...(this.usuarioForm.value.sucursales || [])];
    if (!seleccionadas.includes(s)) {
      seleccionadas.push(s);
      this.usuarioForm.patchValue({ sucursales: seleccionadas });
    }
  }

  removerSucursal(s: string) {
    if (!this.formActivo) return;
    const seleccionadas = [...(this.usuarioForm.value.sucursales || [])].filter(x => x !== s);
    this.usuarioForm.patchValue({ sucursales: seleccionadas });
  }

  // Guardar o actualizar usuario
  accionBotonUsuario() {
    if (!this.formActivo) return;
    if (this.usuarioForm.invalid) return;

    const usuario = { ...this.usuarioForm.value };
    if (!usuario.idusuario) usuario.idusuario = Date.now();

    if (this.botonGuardar) this.listaUsuarios.push(usuario);
    else {
      const index = this.listaUsuarios.findIndex(u => u.idusuario === usuario.idusuario);
      if (index !== -1) this.listaUsuarios[index] = usuario;
    }

    this.mostrarFormulario = false;
    this.formActivo = false; // <-- deshabilitar después de guardar
    this.usuarioForm.reset({ rol: [], sucursales: [] });
    this.botonGuardar = true;
  }

  // Eliminar usuario
  eliminarUsuario(u: any) {
    this.listaUsuarios = this.listaUsuarios.filter(x => x.idusuario !== u.idusuario);
  }
}
