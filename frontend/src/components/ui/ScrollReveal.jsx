import { motion } from 'framer-motion';

const ScrollReveal = ({ children, className = '', duration = 0.5, delay = 0, threshold = 0.2 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}

            viewport={{
                once: true,
                amount: threshold,
                margin: "0px 0px -100px 0px" // Adds a bit of buffer so it doesn't disappear immediately
            }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
