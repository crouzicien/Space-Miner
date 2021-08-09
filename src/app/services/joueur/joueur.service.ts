import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {
  private devMode = true

  public credit = 0
  public currentRessource

  public ressources = [
    {
      type: 'bronze',
      qte: 0,
      price: 1,
      selected: true,
      autoSell: false,
    },
    {
      type: 'fer',
      qte: 0,
      price: 2,
      selected: false,
      autoSell: false
    },
    {
      type: 'lead',
      qte: 0,
      price: 6,
      selected: false,
      autoSell: false
    },
    {
      type: 'silica',
      qte: 0,
      price: 6,
      selected: false,
      autoSell: false
    }
  ]
  selectRessource(ressource) {
    this.ressources.map(x => x.selected = false)
    ressource.selected = true
    this.currentRessource = ressource
  }

  
  public vente = {
    percent: 100,
    
    getQte(){
      return Math.round((this.percent * this.joueurService().currentRessource.qte)/100)
    },
    getTotal() {
      return Math.round((this.percent * this.joueurService().currentRessource.qte) / 100) * this.joueurService().currentRessource.price
    },
    joueurService: () => {
      return this
    },
    sellCurrent(){
      this.joueurService().credit += this.getTotal()
      this.joueurService().currentRessource.qte -= this.getQte()      
    },
    sell(ressource){
      let currentRessource = this.joueurService().ressources.find(res => res.type == ressource.type)
      this.joueurService().credit += ressource.qte * currentRessource.price
    },
    triggerAuto(){
      this.joueurService().currentRessource.autoSell = !this.joueurService().currentRessource.autoSell
      if(this.joueurService().currentRessource.autoSell){
        this.sell(this.joueurService().currentRessource)
        this.joueurService().currentRessource.qte = 0
      }
    }

  }

  constructor() {
    this.currentRessource = this.ressources[0]
  }


}
