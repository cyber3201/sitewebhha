(function(){
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  const navLinks = nav.querySelectorAll('a');
  function openMenu(){
    nav.hidden = false;
    nav.classList.add('open');
    menuBtn.setAttribute('aria-expanded','true');
    const focusable = nav.querySelectorAll('a');
    const first = focusable[0];
    const last = focusable[focusable.length-1];
    function trap(e){
      if(e.key === 'Tab'){
        if(e.shiftKey && document.activeElement===first){
          e.preventDefault(); last.focus();
        } else if(!e.shiftKey && document.activeElement===last){
          e.preventDefault(); first.focus();
        }
      }
      if(e.key === 'Escape') closeMenu();
    }
    nav.addEventListener('keydown', trap);
  }
  function closeMenu(){
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    nav.hidden = true;
  }
  menuBtn.addEventListener('click', ()=>{
    if(nav.classList.contains('open')) closeMenu(); else openMenu();
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });

  // Smooth scroll with offset
  const navbar = document.querySelector('.navbar');
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if(target){
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({top, behavior:'smooth'});
        closeMenu();
      }
    });
  });

  // IntersectionObserver for active nav
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const link = document.querySelector(`#primary-nav a[href='#${entry.target.id}']`);
      if(link){
        if(entry.isIntersecting){
          navLinks.forEach(l=>l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  },{rootMargin:'0px 0px -60% 0px'});
  sections.forEach(s=>observer.observe(s));

  // Carousel
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.hero-pager .dot');
  let current = 0;
  function showSlide(i){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i+slides.length)%slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  dots.forEach((d,i)=>d.addEventListener('click',()=>showSlide(i)));
  setInterval(()=>showSlide(current+1),5000);

  document.querySelector('.scroll-down').addEventListener('click',()=>{
    document.getElementById('about').scrollIntoView({behavior:'smooth'});
  });

  // Forms
  function handleForm(form){
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      if(form.querySelector('.hp').value) return; // honeypot
      const status = form.querySelector('.form-status');
      try{
        const res = await fetch(form.dataset.endpoint,{method:'POST',body:new FormData(form)});
        if(res.ok){
          status.textContent='Thank you!';
          status.className='form-status success';
          form.reset();
        } else throw new Error();
      }catch(err){
        status.textContent='Submission failed. Please try again.';
        status.className='form-status error';
      }
    });
  }
  document.querySelectorAll('form[data-endpoint]').forEach(handleForm);

  // Back to top
  const back = document.getElementById('backToTop');
  back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll',()=>{
    back.classList.toggle('show', window.scrollY > 300);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
