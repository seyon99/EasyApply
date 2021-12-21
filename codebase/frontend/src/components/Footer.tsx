import React from 'react'

const Footer = () => {
    return (
        <div>
             <footer className="bg-white border-t border-gray-400 shadow">
         <div className="container mx-auto flex py-8">
            <div className="w-full mx-auto flex flex-wrap">
               <div className="flex w-full lg:w-1/2 ">
                  <div className="px-8">
                     <h3 className="font-bold text-gray-900">About</h3>
                     <p className="py-4 text-gray-600 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel mi ut felis tempus commodo nec id erat. Suspendisse consectetur dapibus velit ut lacinia. 
                     </p>
                  </div>
               </div>
               <div className="flex w-full lg:w-1/2 lg:justify-end lg:text-right">
                  <div className="px-8">
                     <h3 className="font-bold text-gray-900">Social</h3>
                     <ul className="list-reset items-center text-sm pt-3">
                        <li>
                           <a className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:underline py-1" href="#">Add social links</a>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
         </footer>
        </div>
    )
}

export default Footer

