// import apiClient from "./login-related/apiClient";
// import { useState } from "react";

// const AddGroup = () => {
//     const [formData, setFormData] = useState({
//             groupname: ''
//         });
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         alert(`Field 1: ${formData.groupname}`);
//         console.log(tryToAddgroup(formData.groupname));
//         };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     return (<div>
//         <label>group name to add: </label>
//         <form onSubmit={handleSubmit}>
//         <input 
//           type="text"
//           id="groupname"
//           name="groupname"
//           value={formData.groupname}
//           onChange={handleChange} 
//         />
//         <button type="submit">Add group</button>
//         Add the added group if added successfully into the sidebar with groups
//         Make sidebar dynamic too? If someone adds our current user.. Won't require adding anything manually.
//         </form>

//     </div>);
// }

// async function tryToAddgroup(groupnamePassed) {
//     const addGroupData = {
//         groupname: groupnamePassed,
//       };

//       try {
//         const response = await apiClient.post
//         ('/groups/create-group', addGroupData.groupname);
//         console.log(
//             "Added group successfully! Response data: ",
//             response.data
//             );
//             if(response.satus = 200) {
//                 console.log("AAAAA");
//             }
//       } catch (error) {
//         console.log("Couldn't add group with group name: ",
//             addGroupData.groupname);
//         console.error("Error during add group request: ",
//             error);
//       }

// }

// export default AddGroup;