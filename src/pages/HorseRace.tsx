import { useEffect, useRef, useState } from 'react'
import { Progress, Button, Typography, Select } from 'antd'
import Confetti from "react-confetti"

const { Title } = Typography
const { Option } = Select

type Horse = {
  name: string
  progress: number
}

const defaultHorse: Horse[] = [
  { name: 'Caballo 1', progress: 0 },
  { name: 'Caballo 2', progress: 0 },
  { name: 'Caballo 3', progress: 0 },
  { name: 'Caballo 4', progress: 0 }
]

const HorseRace = () => {
  const [horses, setHorses] = useState<Horse[]>(defaultHorse)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [selectedHorseOption, setSelectedHorseOption] = useState<string | null>(null)
  const [selectedHorse, setSelectedHorse] = useState<string | null>(null)
  


  const intervals = useRef<any[]>([])

  const getRandomDelay = () => Math.random() * 2000
  const getRandomIncrement = () => Math.floor(Math.random() * 15) + 1

  const runHorse = (index: number) => {
    const tick = () => {
      if (!isRunning || winner) return

      setHorses(prev => {
        const copy = [...prev]
        const horse = copy[index]
        if (horse.progress >= 100) return prev

        const increment = getRandomIncrement()
        const newProgress = Math.min(horse.progress + increment, 100)
        copy[index] = { ...horse, progress: newProgress }

        if (newProgress >= 100 && !winner) {
          setWinner(horse.name)
          setIsRunning(false)
        }

        return copy
      })

      intervals.current[index] = setTimeout(tick, getRandomDelay())
    }

    tick()
  }

  const startRace = () => {
    if (!selectedHorseOption) return
    setHorses(defaultHorse)
    setWinner(null)
    setIsRunning(true)
    setSelectedHorse(selectedHorseOption)
  }

  const resetRace = () => {
    intervals.current.forEach(clearTimeout)
    intervals.current = []
    setIsRunning(false)
    setWinner(null)
    setSelectedHorse(null)
    setSelectedHorseOption(null)
    setHorses(defaultHorse)
  }

  useEffect(() => {
    if (isRunning) {
      horses.forEach((_, idx) => runHorse(idx))
    }
    return () => {
      intervals.current.forEach(clearTimeout)
      intervals.current = []
    }
  }, [isRunning])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: 20,
        boxSizing: 'border-box',
        background: '#f0f2f5',
        overflow: 'hidden'
      }}
    >
      {winner && selectedHorse && winner === selectedHorse && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>🏇 Carrera de Caballos</Title>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 40
        }}
      >
        {/* Lista de Caballos */}
        <div
          style={{
            flex: '1 1 400px',
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            gap: 25
          }}
        >
          {horses.map((horse, idx) => (
            <div key={idx}>
              <Title level={5} style={{ marginBottom: 8 }}>{horse.name}</Title>
              <Progress percent={horse.progress} status={winner === horse.name ? 'success' : 'active'} />
              {winner === horse.name && (
                <div style={{ marginTop: 5, fontWeight: 'bold', fontSize: 16 }}>
                  {selectedHorse === horse.name ? '🎉 ¡Ganaste tu apuesta!' : '😢 Perdiste la apuesta'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Controles */}
        <div
          style={{
            width: 300,
            minWidth: 260,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
            padding: 20,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Title level={4}>Controles</Title>

          <Select
            style={{ width: '100%' }}
            placeholder="Elige tu caballo ganador"
            onChange={(value) => setSelectedHorseOption(value)}
            value={selectedHorseOption}
            disabled={isRunning}
          >
            {defaultHorse.map((horse, idx) => (
              <Option key={idx} value={horse.name}>{horse.name}</Option>
            ))}
          </Select>

          <Button
            type="primary"
            block
            onClick={startRace}
            disabled={isRunning || !selectedHorseOption}
          >
            Iniciar
          </Button>

          <Button block onClick={resetRace}>
            Reiniciar
          </Button>

          {winner && (
            <div style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold', color: selectedHorse === winner ? '#52c41a' : '#ff4d4f', textAlign: 'center' }}>
              ✔️ Escogido:<br />{selectedHorse}
              <br />
              <br />
              🏁 Ganador:<br />{winner}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HorseRace
