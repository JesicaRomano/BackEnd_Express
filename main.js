const express = require('express');

const PUERTO = 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const fs = require ('fs');

class ProductManager {

    constructor() {
        this.path = "./productos.txt";
        this.products = [];
        this.productIdCounter = 1;
    }

    addProducts = async (title, description, price, thumbnail, code, stock) => {
        const existingProduct = this.products.find(
            (product) => product.code === code
        ); 
    
        existingProduct
            ? console.log("El producto con este código, ya existe")
            : !title || !description || !price || !thumbnail || !code || !stock
            ? console.log("Todos los items son requeridos")
            : this.products.push({
                id: this.productIdCounter++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                });
        
        let newProduct = {
            id: this.productIdCounter++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
        }
        this.products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
    }
    
    readProducts = async () => {
        let respuesta = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(respuesta)
    }

    getProducts = async () => {
        let respuesta2 = await this.readProducts()
        return console.log(respuesta2);
    } 
    
    getProductsById = async (id) => {
        let respuesta3 = await this.readProducts()
        if(!respuesta3.find(product => product.id === id)) {
            console.log("Producto no encontrado");
        } else {
            console.log(respuesta3.find(product => product.id === id));
        }
    };

    deleteProductsById = async (id) => {
        let respuesta4 = await this.readProducts();
        let productFilter = respuesta4.filter(product => product.id != id)
        await fs.promises.writeFile(this.path, JSON.stringify(productFilter))
        console.log("Producto eliminado");
    }
    
    updateProducts = async ({id, ...producto}) => {
        await this.deleteProductsById(id);
        let productOld = await this.readProducts();
        let productsNew = [{...producto, id}, ...productOld];
        await fs.promises.writeFile(this.path, JSON.stringify(productsNew))
    }
};

    

const manager = new ProductManager();
/* manager.addProducts('Pantalón Jeans', 'Pantalón de jeans chupin', 15000, 'img', 0001, 10);
manager.addProducts('Pantalón Sastrero', 'Pantalón de vestir sastrero chupin', 15000,'img', 0002, 8);
manager.addProducts('Camisa', 'Camisa estampada', 9000, 'img', 0003, 4);
manager.addProducts('Remera', 'Remera de algodón', 4000, 'img', 0004, 15);
manager.addProducts('Blusa', 'Blusa de seda lisa', 7000,'img', 0005, 6);
manager.addProducts('Sweater', 'Sweater de lana liso', 12000, 'img', 0006, 5);
manager.addProducts('Tapado', 'Tapado de gabardina liso', 50000, 'img', 0007, 2);
manager.addProducts('Campera', 'Campera de cuero', 40000,'img', 0011, 3);
manager.addProducts('Musculosa', 'Musculosa de algodón estampada', 6000, 'img', 0012, 9);
manager.addProducts('Pollera', 'Pollera de jeans', 11000, 'img', 0010, 7); */
//console.log(manager.getProducts());

/*manager.getProductsById(8);
manager.getProductsById(1);  

manager.deleteProductsById(1)

manager.updateProducts({
    id: 4,
    title: 'Pantalón Sastrero',
    description: 'Pantalón de vestir sastrero chupin',
    price: 5000,
    thumbnail: 'img',
    code: 2,
    stock: 8
})

*/

//Utilización de servidor express

app.get('/products', async(req, res) => {

    let limit = parseInt(req.query.limit);
    if (!limit) return res.send(await manager.readProducts())
    let allProducts = await manager.readProducts();
    let productLimit = allProducts.slice(0, limit);
    res.send(productLimit);
})

app.get('/products/:id', async(req, res) => {
    let id = parseInt(req.params.id);
    let allProducts = await manager.readProducts();
    let productsById = allProducts.find(product => product.id === id);
    res.send(productsById);
});  

app.listen(PUERTO, () => {
    console.log(`Servidor backend activo en puerto ${PUERTO}`);
});
