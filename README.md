# ng-brl-currency-mask


Diretiva para mascara de input para angular 13+

##uso

Importar no modulo do App ou shared 

e usar da seguinte forma 


```html
 <input
    type="text"
    brlMask
    #inputValor
    (brlMaskValue)="calculaValor($event)"
  />
```
