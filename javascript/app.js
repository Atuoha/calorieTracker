// Storage Controller

const StorageCtrl =  (function(){

return{
// Add Item to LS
storeItem: function(item){
    let items;

    // Checking if any item on LS
    if(localStorage.getItem('items') === null){

        items = []; // eMPTY ARRAY

        //Push new item to items Array oBject
        items.push(item);

        // Set Item to LS
        localStorage.setItem('items',JSON.stringify(items));
    }else{
        // Get Item from LS
        items = JSON.parse(localStorage.getItem('items'));

        // Push new Item
        items.push(item);

       // Reset Ls
       localStorage.setItem('items',JSON.stringify(items));

    }

    
},

// Get Item from LS 
    getItemFromLS: function(){
        let items;
        // Check if item exists in LS
        if(localStorage.getItem('items') === null){
            items = [];
        }else{
            items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
    },

// Update from LS
    updateItemLS:function(dataInput){
       items = JSON.parse(localStorage.getItem('items'));

       items.forEach(function(item,index){
           if(dataInput.id == item.id){
               items.splice(index,1,dataInput)
           }
       })
       localStorage.setItem('items',JSON.stringify(items));
    },


// Delete Item from LS
    deleteItemLS:function(id){
        items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item,index){
           if(id === item.id){
               items.splice(index,1);
           }
        });
        localStorage.setItem('items',JSON.stringify(items));

    },


// Delete ALL Items from LS
    deleteAllItem:function(){
        items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item,index){
            items.splice(index);
        })
        localStorage.setItem('items',JSON.stringify(items))
    }
}

})();






// Item Controller
const ItemCtrl = (function(){

    // Constructor
    const item = function(id,name,calorie){
        this.id = id;
        this.name = name;
        this.calorie = calorie;
    }

    // Data Structure
    const data = {
        // items: [
            // {id:0,name:'Fish',calorie:50},
            // {id:1,name:'Garri',calorie:150},   // used this when items where not stored locally
            // {id:2,name:'Rice',calorie:500}
        // ],

        items: StorageCtrl.getItemFromLS(),
        total_calories:0,
        currentItem:null
    }



    // Public Methods
    return{
        // Fetch Items
        getItem: function(){
            return data.items
        },
        logData:function(){
            return data;
        },
        // Add Items
        addItem: function(name,calorie){
           //Obtain ID(autoIncrement)
           let ID;
           if(data.items.length > 0){
            ID = data.items[data.items.length - 1].id + 1;
           }else{
               ID = 1;
           }

           // Coverting calories to numbers
            calorie = parseInt(calorie);

            // Adding Item to List
             newItem = new item(ID,name,calorie);


            //  Pushing new Item to List -- The Item List is an array
             data.items.push(newItem)   

             return newItem;

        },
        updateItem: function(name,calorie){
            const id = data.currentItem.id;

            data.items.forEach(function(item){
                if(item.id === id){
                    item.name = name;
                    item.calorie = parseInt(calorie)
                    console.log('Perfect');
                }else{
                    console.log('There are shits buddy!')
                }
            })
            return id;

        },

        // get TotalCalories
        getTotalCalories: function(){
            let total = 0;
            // Looping 
            data.items.forEach(function(item){
                total += item.calorie
            })
            // Adding item Calorie to Total Calories
            data.total_calories = total;

            return data.total_calories;
        },
        
        // get Item to edit
        getItemById: function(id){
            let found = null;
             data.items.forEach(function(item){
                 if(item.id === id){
                     found = item;
                 }
             });
             return found;

        },
        setCurrentItem: function(item){
            data.currentItem = item;
            
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        deleteItem:function(id){

            // Use map to return ids
            const ids = data.items.map(function(item){
                return item.id;
            })

            // Get index 
            const index = ids.indexOf(id);

            // Remove item from array
            data.items.splice(index,1); // Splice is an array function that removes item from an array using it's index, the second parameter is the number of items to remove from the array. if you leave it empty, it'll remove all items from the item
            
            UICtrl.removeItemfromUI(id);
        },
        delAll: function(){
            data.items = [];

        },

    }

})()












// UI Controller
const UICtrl = (function(){
    
    // UISelectors
    const UISelectors = {
        displayItems: 'item-list',
        addBtn: '.add-btn',
        inputItem: 'item-name',
        inputCalorie: 'item-calories',
        divCard: '.card',
        editBtn: '.edit-item',
        updatebtn: '.update-btn',
        delBtn: '.delete-btn',
        editStateBTNs: '.edit_state',
        showTotalCalo: '.total-calories',
        backBtn: '.back-btn',
        clearAll: '.clear-btn',
        listItems: '.collection-item',
        

    }

    // Set Alert
    const setAlert = function(msg,className){

        timeOut(); // Make it appear only once by calling the timeout function before anything
        const div = document.createElement('div');
        div.classList = `msg className center-align`;
        div.appendChild(document.createTextNode(msg));
        div.style.padding = '5px';
        div.style.background = className;
        div.style.color = 'white';
        document.querySelector(UISelectors.divCard).appendChild(div);
        setTimeout(timeOut,3500);
    }

    // Timeout
    const timeOut = function(){
        const errorMsg = document.querySelector('.msg');

        if(errorMsg){
            errorMsg.remove();
        }
    }

    // Public Methods
    return{
        // Populating List Items
        populateListItems: function(items){
            let output = '';
            items.forEach(function(item){
                output +=  `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `
            })

            document.getElementById(UISelectors.displayItems).innerHTML = output;
        },

        getUISelector: function(){
            return UISelectors;
        },

        //Alert Msg
        getShowAlert: function(msg,className){
            return setAlert(msg,className)
        },
        
        // Form Input for Adding Item
        getItemInput: function(){
        const item = document.getElementById(UISelectors.inputItem).value;
        const calorie_input = document.getElementById(UISelectors.inputCalorie).value;
            return{
                name: item,
                calorie:calorie_input,
                
            }
        },

        

        // Adding Item to UI
        addItemToUI: function(item){
            // Unhide <ul> element
            document.getElementById(UISelectors.displayItems).style.display = 'block';

            // Create a list element from Scratch
            const li = document.createElement('li');
            li.innerHTML =  `      
            <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
            `;
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            document.getElementById(UISelectors.displayItems).appendChild(li);
            
        },
        removeItemfromUI:function(id){

            const dataId = 'item-'+ id;

            document.getElementById(dataId).remove();
            this.clearEditState();

             // Set up an alert for deleting success
             this.getShowAlert('Item Deleted Successfully!','red');
            
        },

        updateList: function(item_id,name,calorie){    
            const itemId =  'item-'+ item_id;

            // Removing the old item from UI completely
            document.getElementById(itemId).remove();


             // Create a list element from Scratch
             const li = document.createElement('li');
             li.innerHTML =  `      
             <strong>${name}: </strong> <em>${calorie} Calories</em>
             <a href="#" class="secondary-content">
             <i class="edit-item fa fa-pencil"></i>
             </a>
             `;
             li.className = 'collection-item';
             li.id = `${itemId}`;
             document.getElementById(UISelectors.displayItems).appendChild(li);
        },

        removeAllItemFromUI: function(){
            // document.getElementById(UISelectors.displayItems).innerHTML = '';  // You can also use this

            const listItems = document.querySelectorAll(UISelectors.listItems);

            // Convert listItems to Array
            const ArrListItems = Array.from(listItems);

            // Loop Through each to remove;
            ArrListItems.forEach(function(listitem){
                listitem.remove();
            })

            // This remove the <ul> Element that holds the <li> elements
            document.getElementById(UISelectors.displayItems).style.display = 'none';

            // Set up an alert for deleting success
            this.getShowAlert('All Items Deleted!','red');
        },

        showTotalCalorie: function(totalCalories){
            // Displaying Total Calories
            document.querySelector(UISelectors.showTotalCalo).innerText  = totalCalories;
        },
        clearEditState: function(){
             // Empty input fields
             document.getElementById(UISelectors.inputItem).value = '';
             document.getElementById(UISelectors.inputCalorie).value = '';
             
            //  Hide Edit State Btns (Edit and Delete Btn)
            document.querySelector(UISelectors.updatebtn).style.display = 'none'; // Update Btn
            document.querySelector(UISelectors.delBtn).style.display = 'none';  // Delete Btn
            document.querySelector(UISelectors.backBtn).style.display = 'none'; // Back Btn

            // Turn Add Btn to visible
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        addEditState: function(){  // EDIT BUTTONS AND STUFF
            // Empty input fields
            document.getElementById(UISelectors.inputItem).value = '';
            document.getElementById(UISelectors.inputCalorie).value = '';
            
           //  Hide Edit State Btns (Edit and Delete Btn)
           document.querySelector(UISelectors.updatebtn).style.display = 'inline'; // Update Btn
           document.querySelector(UISelectors.delBtn).style.display = 'inline';  // Delete Btn
           document.querySelector(UISelectors.backBtn).style.display = 'inline'; // Back Btn

           // Turn Add Btn to visible
           document.querySelector(UISelectors.addBtn).style.display = 'none';

       },

       addItemtoForm: function(){
            
            // Add Clicked item to input boxes for editing
            document.getElementById(UISelectors.inputItem).value = ItemCtrl.getCurrentItem().name;
            document.getElementById(UISelectors.inputCalorie).value = ItemCtrl.getCurrentItem().calorie;
        },




    }


})()










// App Controller
const App = (function(ItemCtrl,UICtrl,StorageCtrl){

   // Pulling UISelectors from UICtrl
const UISelectors = UICtrl.getUISelector();

    // Load EventListeners
    const eventListeners = function(){
        // Add Item to List Click Event
        document.querySelector(UISelectors.addBtn).addEventListener('click',addItem);

        // Edit Item Click Event(font awesome -pencil)
        document.body.addEventListener('click',editItem);

        // Update Btn Click
        document.querySelector(UISelectors.updatebtn).addEventListener('click',itemUpdate);

        // Delete Btn Click
        document.querySelector(UISelectors.delBtn).addEventListener('click',itemDelSubmit)

        // Back Btn Click
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

        // Clear All Btn
        document.querySelector(UISelectors.clearAll).addEventListener('click',clearAll)

    }


    // Function clearAll()
    function clearAll(e){

        if(document.querySelector(UISelectors.showTotalCalo).innerHTML === '0'){
            alert('There are no Items to clear');
        }else{

            if(confirm('Do you want to clear all?')){
                //DelAll function from ItemCtrl
                ItemCtrl.delAll();

            // Obtaining total Calories from ItemCtrl
            const totalCalorie = ItemCtrl.getTotalCalories();

            // Updating Total Calories on your UI
            UICtrl.showTotalCalorie(totalCalorie);

            // Deleting all Item from UI
            UICtrl.removeAllItemFromUI();

            // Clear Edit State If Any
            UICtrl.clearEditState();

            // Delete all from LocALstorage
            StorageCtrl.deleteAllItem()

            }else{
                console.log('Ok we will not clear');
            }
        }

        e.preventDefault();
    }




    // Delete Function
    function itemDelSubmit(e){
        // Get CurrentItem from ItemCtrl
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete Item from Data Structure
        ItemCtrl.deleteItem(currentItem.id);

         // Obtaining total Calories from ItemCtrl
         const totalCalorie = ItemCtrl.getTotalCalories();

         // Updating Total Calories on your UI
         UICtrl.showTotalCalorie(totalCalorie);

        //  Delete from storage
        StorageCtrl.deleteItemLS(currentItem.id)

        e.preventDefault();
    }

    //Edit Item Function
    function editItem(e){
      if(e.target.parentElement.className === 'secondary-content'){
        UICtrl.addEditState();

        const listid = e.target.parentElement.parentElement.id;
        // Split Id to obtain only the number from it (It returns something like item-3)
        const listArr = listid.split('-');

        const id = parseInt(listArr[1]); // listArr returns an array. item will be of zero index while the id will be one

        // Obtain item
        const itemtoEdit = ItemCtrl.getItemById(id);

        // Spliting the returns of getItemById, it has both the item and the calorie inside
        // console.log(itemtoEdit);

        // Set item to currentItem
        ItemCtrl.setCurrentItem(itemtoEdit);

        // Adding the clicked item to form
        UICtrl.addItemtoForm();

        
        console.log(id);

      }
      e.preventDefault();
    }


        // Update Item function
        function itemUpdate(e){
            const input = UICtrl.getItemInput();
    
            // updating
            const updatItem = ItemCtrl.updateItem(input.name,input.calorie);
    
            // adding to UI
            UICtrl.updateList(updatItem,input.name,input.calorie);
            
            // Create Alert
            UICtrl.getShowAlert('Bravos! Item was updated successfully','green');

            // Obtaining total Calories from ItemCtrl
            const totalCalorie = ItemCtrl.getTotalCalories();

            // Object to be used for updating in LS
            const dataInput ={
                name: input.name,
                calorie: parseInt(input.calorie),
                id:updatItem
            }

            // Updating in LS
            StorageCtrl.updateItemLS(dataInput);

            // Clear edit State
            UICtrl.clearEditState();

            // Updating Total Calories on your UI
            UICtrl.showTotalCalorie(totalCalorie);
    
            e.preventDefault()
        }



    // Add Item function
    function addItem(e){
        // Input From UICtrl
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calorie !== ''){
            // Add Item to List
            const newItem = ItemCtrl.addItem(input.name,input.calorie);

            // Add Item to UI
            UICtrl.addItemToUI(newItem);

            // Create Alert
            UICtrl.getShowAlert('Bravos! Item was added successfully','green');

            //Add calories to Total_Calories (Totalizing Calories)
            // Obtaining total Calories from ItemCtrl
            const totalCalorie = ItemCtrl.getTotalCalories();
            // Updating Total Calories on your UI
            UICtrl.showTotalCalorie(totalCalorie);

            // You can also obtain Total Calories using 
            // const totalCalcorie = document.querySelector('.total-calories').innerText
            // const input = document.querySelector('#item-calories').value;
            // total = totalCalorie;
            // total += parseInt(input);
            // document.querySelector('.total-calories').innerText  = totalCalorie;
            
            // Store Item to localStorage
            StorageCtrl.storeItem(newItem);

            // Empty input fields
            document.getElementById(UISelectors.inputItem).value = '';
            document.getElementById(UISelectors.inputCalorie).value = '';

        }else{
            UICtrl.getShowAlert('Opps!! You certainly have to enter something','red');
        }
        e.preventDefault();
    }
    

    // Init
    return{
        init: function(){
            // Removing all Edit State Elements through UICtrl Function
            UICtrl.clearEditState();

            const items = ItemCtrl.getItem();
            // console.log(items);

            // Check for items Availability in order to  show the <ul> element or not
            if(items.length > 0){
                document.getElementById(UISelectors.displayItems).style.display = 'block';
                UICtrl.populateListItems(items);
            }else{
                document.getElementById(UISelectors.displayItems).style.display = 'none';
            }

            UICtrl.populateListItems(items);

            // Load EventListeners
            eventListeners();

             // Obtaining total Calories from ItemCtrl
             const totalCalorie = ItemCtrl.getTotalCalories();

             // Updating Total Calories on your UI
             UICtrl.showTotalCalorie(totalCalorie);

 
        }
    }
})(ItemCtrl,UICtrl,StorageCtrl);


// Init App
App.init();