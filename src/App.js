import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Navbar from './layout/Navbar';
import Authorization from './pages/Authorization';
import AdminHome from './pages/AdminHome';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AddUser from './users/AddUser';
import EditUser from './users/EditUser';
import ViewUser from './users/ViewUser';
import Register from './users/Register.js';
import Users from './pages/Users';

import Products from './pages/Products';
import AddProduct from './products/AddProduct';
import EditProduct from './products/EditProduct';
import UserHome from './pages/UserHome';

import Positions from './pages/Positions';
import AddPosition from './positions/AddPosition';
import EditPosition from './positions/EditPosition';

import AddDocumentation from './documents/AddDocumentation';
import AddProductDocumentation from './documents/AddProductDocumentation';
import Documentations from './pages/Documentations';
import ViewDocumentation from './documents/ViewDocument';

import Details from './pages/Details';
import AddDetail from './details/AddDetail';
import EditDetail from './details/EditDetail';
import UserDetails from './pages/UserDetails';

import Plans from './pages/Plans';
import AddPlan from './plans/AddPlan';
import AddProductPlan from './plans/AddProductPlan';
import AdminDocumentations from './pages/AdminDocumentations';

import Materials from './pages/Materials';
import AddMaterial from './materials/AddMaterial';

import AdminPlans from './pages/AdminPlans';
import AdminDetails from './pages/AdminDetails';




function App() {
  return (
    <div className="App">
      <Router>

        <Navbar />
        <Routes>
          <Route exact path="/" element={<Authorization />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/adminhome" element={<AdminHome />} />
          <Route exact path="/userhome" element={<UserHome />} />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/adduser" element={<AddUser />} />
          <Route exact path="/edituser/:id" element={<EditUser />} />
          <Route exact path="/viewuser/:id" element={<ViewUser />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/addproduct" element={<AddProduct />} />
          <Route exact path="/editproduct/:id" element={<EditProduct />} />
          <Route exact path="/positions" element={<Positions />} />
          <Route exact path="/addposition" element={<AddPosition />} />
          <Route exact path="/editposition/:id" element={<EditPosition />} />
          <Route exact path="/documentations" element={<Documentations />} />
          <Route exact path="/adddocumentation" element={<AddDocumentation />} />
          <Route exact path="/addproductdocumentation" element={<AddProductDocumentation />} />
          <Route exact path="/viewdocumentation/:id" element={<ViewDocumentation />} />
          <Route exact path="/details" element={<Details />} />
          <Route exact path="/adddetail" element={<AddDetail />} />
          <Route exact path="/editdetail/:id" element={<EditDetail />} />
          <Route exact path="/userdetails/:id" element={<UserDetails />} />
          <Route exact path="/plans" element={<Plans />} />
          <Route exact path="/addplan" element={<AddPlan />} />
          <Route exact path="/addproductplan" element={<AddProductPlan />} />
          <Route exact path="/admindocumentations" element={<AdminDocumentations />} />
          <Route exact path="/materials" element={<Materials />} />
          <Route exact path="/addmaterial" element={<AddMaterial />} />
          <Route exact path="/adminplans" element={<AdminPlans />} />
          <Route exact path="/admindetails/:id" element={<AdminDetails />} />
        </Routes>

      </Router>
    </div>
  );
}

export default App;
