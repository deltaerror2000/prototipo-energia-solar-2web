import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDown, ArrowRight, BatteryCharging, Check, ChevronDown, CircleDollarSign,
  Clock3, Gauge, HousePlug, Leaf, MapPin, Menu, Moon, ShieldCheck, Sun,
  SunMedium, X, Zap,
} from 'lucide-react'
import SolarScene from './SolarScene.jsx'

const solutions = [
  { icon: HousePlug, title: 'Energia para residências', text: 'Apresente economia, dimensionamento e instalação de forma simples para quem quer reduzir a conta de casa.' },
  { icon: Gauge, title: 'Energia para empresas', text: 'Mostre como o projeto acompanha o perfil de consumo e a operação de cada negócio.' },
  { icon: BatteryCharging, title: 'Monitoramento', text: 'Explique como o cliente acompanha geração, desempenho e histórico depois da instalação.' },
]

const steps = [
  ['Análise', 'A equipe entende o consumo, o imóvel e o objetivo do cliente.'],
  ['Projeto', 'O sistema é dimensionado e a proposta apresenta investimento e potencial de economia.'],
  ['Instalação', 'Equipamentos, homologação e ativação seguem um cronograma combinado.'],
]

const faqs = [
  ['A energia continua funcionando à noite?', 'À noite, o imóvel consome energia da rede. Os créditos gerados pelo excedente durante o dia podem compensar esse consumo, conforme as regras da distribuidora.'],
  ['O sistema funciona em dias nublados?', 'Sim. A geração pode ser menor, mas os painéis continuam produzindo energia com a luminosidade disponível.'],
  ['Quanto tempo leva para instalar?', 'O prazo depende do projeto, dos equipamentos e da aprovação da distribuidora. A versão final do site pode informar o processo real da empresa.'],
  ['Como saber o tamanho do sistema?', 'O dimensionamento considera o histórico de consumo, o local da instalação e as condições do telhado ou terreno.'],
]

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Sua empresa — início">
      <span className="brand-sun"><SunMedium size={21} /></span>
      <span><strong>Sua empresa aqui</strong><small>Energia solar</small></span>
    </a>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [night, setNight] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const sceneRef = useRef(null)

  useEffect(() => {
    let frame
    const update = () => {
      const section = sceneRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const travel = Math.max(window.innerHeight * 0.42, 280)
      const value = Math.min(1, Math.max(0, -rect.top / travel))
      setNight(value)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const isNight = night > 0.55

  return (
    <main style={{ '--night': night }}>
      <section className="scene-scroll" id="inicio" ref={sceneRef}>
        <div className="scene-sticky">
          <SolarScene night={night} />

          <header className="site-header">
            <Brand />
            <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Navegação principal">
              <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
              <a href="#duvidas" onClick={() => setMenuOpen(false)}>Dúvidas</a>
              <a className="nav-cta" href="#simulacao" onClick={() => setMenuOpen(false)}>Simular economia <ArrowRight size={16} /></a>
            </nav>
            <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </header>

          <div className="hero-content">
            <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>Protótipo visual · energia solar</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>Mais economia<br />na conta de luz.</motion.h1>
            <motion.p className="hero-lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }}>Aqui entra a principal promessa da empresa e uma explicação clara de como a energia solar pode transformar o consumo.</motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .23 }}>
              <a className="button primary" href="#simulacao">Exemplo: pedir uma análise <ArrowRight size={18} /></a>
              <span className="scroll-cue">Role para anoitecer <ArrowDown size={15} /></span>
            </motion.div>
          </div>

          <div className="energy-panel">
            <div className="day-night" aria-label={`Cena atual: ${isNight ? 'noite' : 'dia'}`}>
              <span className={!isNight ? 'active' : ''}><Sun size={14} /> Dia</span>
              <span className={isNight ? 'active' : ''}><Moon size={14} /> Noite</span>
              <i style={{ transform: `translateX(${night * 100}%)` }} />
            </div>
            <div className="energy-copy">
              {isNight ? <Moon size={19} /> : <Zap size={19} />}
              <div><small>{isNight ? 'Depois do pôr do sol' : 'Enquanto há luz'}</small><strong>{isNight ? 'Créditos ajudam a compensar' : 'Seu sistema gera energia'}</strong></div>
            </div>
          </div>

          <div className="scene-progress"><span style={{ width: `${Math.round(night * 100)}%` }} /></div>
        </div>
      </section>

      <section className="proof-strip">
        <p>Estrutura sugerida para apresentar</p>
        <div><span><ShieldCheck size={17} /> Garantias reais</span><span><Leaf size={17} /> Economia estimada</span><span><Clock3 size={17} /> Prazo transparente</span></div>
      </section>

      <section className="section intro">
        <p className="section-kicker">Uma decisão que começa com clareza</p>
        <div className="intro-grid">
          <h2>Do sol ao consumo,<br /><em>sem complicar.</em></h2>
          <div><p>O site explica o que o cliente quer saber antes de pedir uma proposta: como funciona, o que muda na conta e quais são os próximos passos.</p><p className="placeholder-note">Números, percentuais e projeções serão substituídos pelos dados reais da empresa.</p></div>
        </div>
      </section>

      <section className="solutions" id="solucoes">
        <div className="solutions-heading"><p className="section-kicker">Estrutura sugerida — soluções</p><h2>Energia pensada para cada consumo.</h2></div>
        <div className="solution-grid">
          {solutions.map(({ icon: Icon, title, text }) => <article key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p><a href="#simulacao">Conhecer solução <ArrowRight size={15} /></a></article>)}
        </div>
      </section>

      <section className="process section" id="como-funciona">
        <div className="process-heading"><p className="section-kicker">Como funciona</p><h2>Um caminho claro<br />até a geração.</h2><p>A ordem mostra o processo que o cliente percorre. Na versão final, cada etapa acompanha a operação real da empresa.</p></div>
        <ol>
          {steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Check size={18} /></li>)}
        </ol>
      </section>

      <section className="simulation" id="simulacao">
        <div className="simulation-copy"><p className="section-kicker">Estrutura sugerida — conversão</p><h2>Quanto o sol pode representar na sua conta?</h2><p>O formulário real poderá receber o consumo médio e direcionar o contato para WhatsApp, CRM ou equipe comercial.</p></div>
        <div className="simulation-card">
          <div><CircleDollarSign size={24} /><span><small>Conta média mensal</small><strong>R$ ———</strong></span></div>
          <div className="fake-range"><span /><i /></div>
          <button type="button">Exemplo: calcular potencial <ArrowRight size={18} /></button>
          <small>Simulação demonstrativa. Valores reais dependem de análise técnica.</small>
        </div>
      </section>

      <section className="faq section" id="duvidas">
        <div><p className="section-kicker">Dúvidas frequentes</p><h2>Antes de instalar.</h2></div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => <article className={openFaq === index ? 'faq-item open' : 'faq-item'} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>{question}<ChevronDown size={20} /></button><div><p>{answer}</p></div></article>)}
        </div>
      </section>

      <footer>
        <div className="footer-top"><Brand /><div className="footer-info"><MapPin size={17} /><span>Endereço da sua empresa<br />Cidade — Estado</span></div><div className="footer-info"><Clock3 size={17} /><span>Seus dias e horários<br />de atendimento</span></div></div>
        <p>Informações, números, garantias, contatos e áreas atendidas serão personalizados.</p>
      </footer>

      <section className="watermark" aria-labelledby="watermark-title">
        <div className="watermark-seal"><img src="/2web-logo.svg" alt="2Web Studios" /></div>
        <div><p className="section-kicker">Aviso de apresentação</p><h2 id="watermark-title">Este site é somente um protótipo.</h2><p>Conteúdo, cálculos, imagens, serviços e contatos são demonstrativos. A versão final será adaptada com a identidade e as informações reais da empresa contratante.</p></div>
        <aside><span>Criação e propriedade intelectual</span><strong>2Web Studios</strong><p>Este protótipo não pode ser reproduzido ou utilizado comercialmente sem autorização.</p></aside>
      </section>
    </main>
  )
}

export default App
