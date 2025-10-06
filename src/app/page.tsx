import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ArrowRight, CheckCircle, Clock, CloudUpload, Folder, ImageIcon, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12  px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="space-y-4 text-center lg:text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Secure Image Storage Platform
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                    Store your{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      images
                    </span>{' '}
                    with confidence
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light">
                    Simple • Secure • Blazing Fast
                  </p>
                </div>

                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto lg:mx-0">
                  The most intuitive platform for storing, organizing, and accessing your images from anywhere.
                </p>

                <div className="flex flex-wrap gap-4 pt-6 justify-center lg:justify-start">
                  <SignedOut>
                    <Link href="/sign-up">
                      <Button 
                        size="lg" 
                        variant="solid" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-lg font-semibold"
                      >
                        Get Started Free
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button 
                        size="lg" 
                        variant="flat" 
                        className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-6 text-lg font-medium transition-all duration-200"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        variant="solid"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-lg font-semibold"
                        endContent={<ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />}
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  </SignedIn>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-6 pt-8 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Setup in 2 minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center order-first lg:order-last">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  {/* Background gradient orb */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                  
                  {/* Main card */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Your Images
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 h-full">
                        {/* Sample images grid */}
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center p-4">
                            <ImageIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 px-4 md:px-6 bg-white dark:bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Powerful features designed to make image storage simple and secure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: CloudUpload,
                  title: "Lightning Fast Uploads",
                  description: "Drag, drop, and watch your images upload in seconds with our optimized pipeline",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Folder,
                  title: "Smart Organization",
                  description: "Automatically organized with AI-powered tagging and smart folders",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: Shield,
                  title: "Military Grade Security",
                  description: "End-to-end encryption and secure sharing options for complete peace of mind",
                  gradient: "from-green-500 to-emerald-500"
                }
              ].map((feature, index) => (
                <Card 
                  key={index}
                  className="group border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden"
                >
                  <CardBody className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-12 px-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust us with their precious memories and important images.
              </p>
              
              <SignedOut>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      endContent={<ArrowRight className="h-5 w-5 ml-2" />}
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="flat"
                      className="border-2 border-white text-white hover:bg-white/10 font-semibold px-10 py-6 text-lg transition-all duration-200"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </SignedOut>
              
              <SignedIn>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    endContent={<ArrowRight className="h-5 w-5 ml-2" />}
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// export default function Home() {
//   return (
//       <div className="flex-col bg-default-50">
//       <main className="flex-1">
//         <section className="py-8 md:py-10 px-4 md:px-6">
//           <div className="container mx-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
//               <div className="space-y-3 text-center lg:text-left">
//                 <div>
//                   <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-default-900 leading-tight">
//                     Store your <span className="text-primary">images</span> with
//                     ease
//                   </h1>
//                   <p className="text-lg md:text-xl text-default-600">
//                     Simple. Secure. Fast.
//                   </p>
//                 </div>

//                 <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
//                   <SignedOut>
//                     <Link href="/sign-up">
//                       <Button size="lg" variant="solid" color="primary">
//                         Get Started
//                       </Button>
//                     </Link>
//                     <Link href="/sign-in">
//                       <Button size="lg" variant="flat" color="primary">
//                         Sign In
//                       </Button>
//                     </Link>
//                   </SignedOut>
//                   <SignedIn>
//                     <Link href="/dashboard">
//                       <Button
//                         size="lg"
//                         variant="solid"
//                         color="primary"
//                         endContent={<ArrowRight className="h-4 w-4" />}
//                       >
//                         Go to Dashboard
//                       </Button>
//                     </Link>
//                   </SignedIn>
//                 </div>
//               </div>

//               <div className="flex justify-center order-first lg:order-last">
//                 <div className="relative w-64 h-64 md:w-80 md:h-80">
//                   <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <ImageIcon className="h-24 md:h-32 w-24 md:w-32 text-primary/70" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Features section */}
//         <section className="py-6 px-4 md:px-6 bg-default-50">
//           <div className="container mx-auto">
//             <div className="text-center mb-8 md:mb-12">
//               <h2 className="text-2xl md:text-3xl font-bold mb-4 text-default-900">
//                 What You Get
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
//               <Card className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow">
//                 <CardBody className="p-6 text-center">
//                   <CloudUpload className="h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-primary" />
//                   <h3 className="text-lg md:text-xl font-semibold mb-2 text-default-900">
//                     Quick Uploads
//                   </h3>
//                   <p className="text-default-600">Drag, drop, done.</p>
//                 </CardBody>
//               </Card>

//               <Card className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow">
//                 <CardBody className="p-6 text-center">
//                   <Folder className="h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-primary" />
//                   <h3 className="text-lg md:text-xl font-semibold mb-2 text-default-900">
//                     Smart Organization
//                   </h3>
//                   <p className="text-default-600">
//                     Keep it tidy, find it fast.
//                   </p>
//                 </CardBody>
//               </Card>

//               <Card className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 max-w-md sm:max-w-full">
//                 <CardBody className="p-6 text-center">
//                   <Shield className="h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-primary" />
//                   <h3 className="text-lg md:text-xl font-semibold mb-2 text-default-900">
//                     Locked Down
//                   </h3>
//                   <p className="text-default-600">
//                     Your images, your eyes only.
//                   </p>
//                 </CardBody>
//               </Card>
//             </div>
//           </div>
//         </section>

//         {/* CTA section */}
//         <section className="py-12 md:py-20 px-4 md:px-6 bg-default-50">
//           <div className="container mx-auto text-center">
//             <h2 className="text-2xl md:text-3xl font-bold mb-4 text-default-900">
//               Ready?
//             </h2>
//             <SignedOut>
//               <div className="flex flex-wrap justify-center gap-4 mt-8">
//                 <Link href="/sign-up">
//                   <Button
//                     size="lg"
//                     variant="solid"
//                     color="primary"
//                     endContent={<ArrowRight className="h-4 w-4" />}
//                   >
//                     Let's Go
//                   </Button>
//                 </Link>
//               </div>
//             </SignedOut>
//             <SignedIn>
//               <Link href="/dashboard">
//                 <Button
//                   size="lg"
//                   variant="solid"
//                   color="primary"
//                   endContent={<ArrowRight className="h-4 w-4" />}
//                 >
//                   Dashboard
//                 </Button>
//               </Link>
//             </SignedIn>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }
