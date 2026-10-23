// viewChild também encontra componentes, pela classe:
private readonly progress = viewChild.required(WorldProgress);

reset(): void {
  this.progress().undo(); // chama um método público do componente filho
}
