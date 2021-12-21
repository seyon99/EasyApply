import React from 'react'

const Nav = () => {
    return (
        <div>
                  <nav id="header" className="fixed w-full z-10 top-0 bg-white border-b border-gray-400">
         <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-4">
            <div className="pl-4 flex items-center">
               
               <a className="text-gray-900 text-base no-underline hover:no-underline font-extrabold text-xl"  href="#"> 
               Help Article
               </a>
            </div>
      
            <div className="w-full flex-grow lg:flex  lg:content-center lg:items-center lg:w-auto hidden lg:block mt-2 lg:mt-0 z-20" id="nav-content">
               <div className="flex-1 w-full mx-auto max-w-sm content-center py-4 lg:py-0">
                  <div className="relative pull-right pl-4 pr-4 md:pr-0">
                     <input type="search" placeholder="Search" className="w-full bg-gray-100 text-sm text-gray-800 transition border focus:outline-none focus:border-purple-500 rounded py-1 px-2 pl-10 appearance-none leading-normal"/>
                     <div className="absolute search-icon" >
                   
                     </div>
                  </div>
               </div>
               <ul className="list-reset lg:flex justify-end items-center">
                  <li className="mr-3 py-2 lg:py-0">
                     <a className="inline-block py-2 px-4 text-gray-900 font-bold no-underline" href="#">Active</a>
                  </li>
                  <li className="mr-3 py-2 lg:py-0">
                     <a className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:underline py-2 px-4" href="#">link</a>
                  </li>
                  <li className="mr-3 py-2 lg:py-0">
                     <a className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:underline py-2 px-4" href="#">link</a>
                  </li>
               </ul>
            </div>
         </div>
      </nav>
        </div>
    )
}

export default Nav
