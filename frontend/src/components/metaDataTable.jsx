// import { useEffect, useState } from 'react';
// import axios from 'axios';
// const handleDownload = (filename) => {
//   const key = 'rategain'; 

//   const downloadUrl = `http://localhost:3000/api/gcs/signed-url/${filename}?key=${key}`;
//   window.location.href = downloadUrl;
// };

// export default function MetadataTable() {
//   const [metadataList, setMetadataList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFileMetadata = async () => {
//       try {
//         const filesRes = await axios.get('http://localhost:3000/api/gcs/files');
//         const filenames = filesRes.data.files || [];

//         const metadataPromises = filenames.map((filename) =>
//           axios.get(`http://localhost:3000/api/gcs/metadata/${filename}`)
//             .then(res => ({ filename, ...res.data.metadata }))
//             .catch(err => {
//               console.error(`Error fetching metadata for ${filename}:`, err);
//               return null;
//             })
//         );

//         const metadataResults = await Promise.all(metadataPromises);
//         setMetadataList(metadataResults.filter(Boolean));
//       } catch (err) {
//         console.error('Error fetching file list:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFileMetadata();
//   }, []);

//   if (loading) {
//     return <p className="text-center text-slate-500 mt-10">Loading metadata...</p>;
//   }

//   return (
//     <div className="overflow-x-auto rounded-lg shadow-md bg-white">
//       <table className="min-w-full table-auto text-sm">
//         <thead className="bg-violet-200 text-slate-800 uppercase tracking-wide">
//           <tr>
//             <th className="px-6 py-4 text-left">File Name</th>
//             <th className="px-6 py-4 text-left">Size (bytes)</th>
//             <th className="px-6 py-4 text-left">Type</th>
//             <th className="px-6 py-4 text-left">Created At</th>
//             <th className="px-6 py-4 text-left">Last Updated</th>
//             <th className="px-6 py-4 text-left">Storage Class</th>
//             <th className="px-6 py-4 text-center">Action</th>
//           </tr>
//         </thead>
//         <tbody className="text-slate-700 divide-y divide-slate-200">
//           {metadataList.map((meta, index) => {
//             const nameOnly = meta.name?.split('.')[0] || 'Unnamed';
//             return (
//               <tr key={index} className="hover:bg-slate-50">
//                 <td className="px-6 py-4 font-medium">{nameOnly}</td>
//                 <td className="px-6 py-4">{meta.size}</td>
//                 <td className="px-6 py-4">{meta.contentType}</td>
//                 <td className="px-6 py-4">{new Date(meta.timeCreated).toLocaleString()}</td>
//                 <td className="px-6 py-4">{new Date(meta.updated).toLocaleString()}</td>
//                 <td className="px-6 py-4">{meta.storageClass}</td>
//                 <td className="px-6 py-4 text-center">
//                 <button
//                   onClick={() => handleDownload(meta.filename)}
//                   className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-medium transition shadow-sm hover:opacity-90"
//                 >
//                   Download
//                 </button>

//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }


//THIS IS USING THE NEW DATABASE API CALLS USING THE BACKEND
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios'; 


const handleDownload = (id) => {
  const downloadUrl = `http://localhost:3000/api/files/download/${id}`;
  window.location.href = downloadUrl;
};

export default function MetadataTable() {
  const [metadataList, setMetadataList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileMetadata = async () => {
      try {
        // Fetch metadata directly from PostgreSQL
        const response = await axiosInstance.get('/files');
        const data = response.data.files || [];
        setMetadataList(data);

      } catch (err) {
        console.error('Error fetching file list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFileMetadata();
  }, []);

  if (loading) {
    return <p className="text-center text-slate-500 mt-10">Loading metadata...</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-violet-200 text-slate-800 uppercase tracking-wide">
          <tr>
            <th className="px-6 py-4 text-left">File Name</th>
            <th className="px-6 py-4 text-left">Size (bytes)</th>
            <th className="px-6 py-4 text-left">Type</th>
            <th className="px-6 py-4 text-left">Created At</th>
            <th className="px-6 py-4 text-left">Last Updated</th>
            <th className="px-6 py-4 text-left">Storage Class</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-slate-700 divide-y divide-slate-200">
          {metadataList.map((meta, index) => {
            const nameOnly = meta.name?.split('.')[0] || 'Unnamed';
            return (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{nameOnly}</td>
                <td className="px-6 py-4">{meta.size}</td>
                <td className="px-6 py-4">{meta.content_type}</td>
                <td className="px-6 py-4">{new Date(meta.time_created).toLocaleString()}</td>
                <td className="px-6 py-4">{new Date(meta.updated).toLocaleString()}</td>
                <td className="px-6 py-4">{meta.storage_class}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDownload(meta.id)}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-medium transition shadow-sm hover:opacity-90"
                  >
                    Download
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
