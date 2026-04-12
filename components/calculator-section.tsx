"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";

export function CalculatorSection() {
  const [production, setProduction] = useState(500000);

  const results = useMemo(() => {
    const traditionalRate = 0.75;
    const luminaRate = 1.0;
    const traditionalIncome = production * traditionalRate;
    const luminaIncome = production * luminaRate;
    const difference = luminaIncome - traditionalIncome;
    const differenceWithMembership = difference - 100 * 1200;
    const maxValue = Math.max(traditionalIncome, luminaIncome);

    return {
      traditionalIncome,
      luminaIncome,
      difference,
      differenceWithMembership,
      traditionalWidth: maxValue > 0 ? (traditionalIncome / maxValue) * 100 : 0,
      luminaWidth: maxValue > 0 ? (luminaIncome / maxValue) * 100 : 0,
    };
  }, [production]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section id="calculadora" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {"Calculá tu Salto de Calidad"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {"Compará tu ingreso actual con lo que podrías ganar en Lumina"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          {/* Slider Input */}
          <div className="mb-10">
            <label
              htmlFor="production-slider"
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              {"Producción Mensual Estimada"}
            </label>
            <div className="mb-4 text-3xl font-bold text-foreground">
              {formatCurrency(production)}
            </div>
            <input
              id="production-slider"
              type="range"
              min={100000}
              max={5000000}
              step={50000}
              value={production}
              onChange={(e) => setProduction(Number(e.target.value))}
              className="w-full cursor-pointer accent-primary"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>$100.000</span>
              <span>$5.000.000</span>
            </div>
          </div>

          {/* Bars */}
          <div className="space-y-6">
            {/* Traditional */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Organizador Tradicional
                </span>
                <span className="text-sm font-bold text-muted-foreground">
                  {formatCurrency(results.traditionalIncome)}
                </span>
              </div>
              <div className="h-10 overflow-hidden rounded-lg bg-secondary">
                <motion.div
                  className="flex h-full items-center rounded-lg bg-muted-foreground/30 px-3"
                  initial={{ width: 0 }}
                  animate={{ width: `${results.traditionalWidth}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <span className="text-xs font-medium text-foreground/70">
                    ~75% de la comisión
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Lumina */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Lumina Plan Digital
                </span>
                <span className="text-sm font-bold text-accent">
                  {formatCurrency(results.luminaIncome)}
                </span>
              </div>
              <div className="h-10 overflow-hidden rounded-lg bg-secondary">
                <motion.div
                  className="flex h-full items-center rounded-lg bg-accent/80 px-3"
                  initial={{ width: 0 }}
                  animate={{ width: `${results.luminaWidth}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <span className="text-xs font-semibold text-accent-foreground">
                    {"100% Auto + Bonos"}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Difference */}
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4">
            <TrendingUp className="h-5 w-5 shrink-0 text-accent" />
            <p className="text-sm text-foreground">
              {"Ganás"}{" "}
              <span className="font-bold text-accent">
                {formatCurrency(results.difference)}
              </span>{" "}
              {"más por mes."}{" "}
              <span className="text-muted-foreground">
                {"Incluso pagando la Membresía Full de $100 USD, ganás más que en el modelo tradicional."}
              </span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/#products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              {"Ver Planes"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
