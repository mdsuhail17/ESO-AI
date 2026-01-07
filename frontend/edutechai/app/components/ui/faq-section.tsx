"use client";

import { PhoneCall } from "lucide-react";
import { Badge } from "./badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import { motion } from "framer-motion";

function FAQ() {
  const faqs = [
    {
      question: "What exactly is ESo AI?",
      answer: "Your smart AI sidekick for textbooks. Upload a PDF, ask questions, and get instant, book-accurate answers or notes—saving hours of manual searching for students and teachers."
    },
    {
      question: "How does the AI ensure answers come from my textbook?",
      answer: "It uses advanced retrieval tech to scan and index your uploaded PDF, pulling exact quotes with page citations. No guessing—everything's grounded in your book to avoid errors."
    },
    {
      question: "Is my data and textbook private?",
      answer: "Absolutely. Uploads are encrypted, stored securely, and deleted after 30 days (or sooner on request). We never share or train on your files—GDPR-compliant for peace of mind."
    },
    {
      question: "Can it handle scanned or handwritten notes?",
      answer: "Yes! Built-in OCR extracts text from images or scans, supporting English and major Indian languages like Hindi. For best results, use clear PDFs."
    },
    {
      question: "What's the free tier like?",
      answer: "Unlimited queries on up to 3 textbooks, with basic exports. Upgrade to Pro (₹99/mo) for unlimited books and advanced features like quiz generation."
    },
    {
      question: "Does it work with my syllabus?",
      answer: "Spot on! Optionally upload your syllabus PDF for auto-aligned queries, like 'Key points from Unit 2.' It maps topics to the right chapters effortlessly."
    },
    {
      question: "How long does uploading and indexing take?",
      answer: "Upload is instant; indexing a 300-page book takes 2–5 minutes (longer for 1,000+ pages). Once done, queries respond in seconds."
    },
    {
      question: "What if the AI doesn't find my answer?",
      answer: "It'll tell you upfront ('Not in this book—try rephrasing or adding context'). You can always chat for tips or upload more resources for broader coverage."
    },
  ];

  return (
    <div className="w-full py-20 lg:py-40 bg-black relative overflow-hidden group">
      {/* Animated Navy Blue Gradient Background on Hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          background: "linear-gradient(135deg, rgba(0, 30, 60, 0.4) 0%, rgba(0, 50, 100, 0.3) 50%, rgba(0, 30, 60, 0.4) 100%)",
        }}
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Additional animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(0, 50, 100, 0.15) 50%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            className="flex gap-10 flex-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex gap-4 flex-col">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge variant="outline" className="border-white/20 text-white/80">FAQ</Badge>
              </motion.div>
              <div className="flex gap-2 flex-col">
                <motion.h4
                  className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Frequently Asked Questions
                </motion.h4>
                <motion.p
                  className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-white/70 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Everything you need to know about ESo AI. Can't find the answer you're looking for? Please reach out to our support team.
                </motion.p>
              </div>
              <motion.div
                className=""
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button className="gap-4 border-white/20 text-white hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300" variant="outline" asChild>
                  <a href="mailto:mdsuhail.code@gmail.com">
                    Any questions? Reach out <PhoneCall className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <AccordionItem
                    value={`index-${index}`}
                    className="border-white/10 group/item relative overflow-hidden rounded-lg p-2 -m-2"
                  >
                    {/* Navy blue gradient on hover for each item */}
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                      style={{
                        background: "linear-gradient(90deg, rgba(0, 30, 60, 0.25) 0%, rgba(0, 50, 100, 0.2) 50%, rgba(0, 30, 60, 0.25) 100%)",
                      }}
                      whileHover={{
                        scale: 1.01,
                      }}
                    />
                    <AccordionTrigger className="text-white hover:text-white/80 relative z-10">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70 relative z-10">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { FAQ };

