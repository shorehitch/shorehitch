import ProductEducation from "../../../components/storefront/product-education";

export default async function ProductLayout({children,params}:{children:React.ReactNode;params:Promise<{handle:string}>}){
 const {handle}=await params;
 return <>{children}<ProductEducation handle={handle}/></>;
}
